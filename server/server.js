// server.js

require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';


const blogApp = express();
const PORT = 5000;




// Set up storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Make sure 'uploads' folder exists!
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage });



// middleware
blogApp.use(cors());
blogApp.use(express.json());

// Serve uploaded files
blogApp.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// MySQL connection using .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to database');
  });
  



  // REGISTER USER using browserUser table
blogApp.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if user already exists
    db.query('SELECT * FROM browserUser WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) return res.status(400).json({ error: 'Email already registered' });
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new user
      db.query(
        'INSERT INTO browserUser (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  });
  


  blogApp.post('/api/login', (req, res) => {
    console.log('Login request received');
    const { email, password } = req.body;
  
    db.query('SELECT * FROM browserUser WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
  
      // Generate JWT
      const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ message: 'Login successful', token });
    });
  });


// add-posts
// Add-posts route
blogApp.post('/api/posts', upload.single('image'), (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    // Log the token for debugging
    console.log('Token:', token);
  
    // Remove 'Bearer ' from the token
    const tokenValue = token.split(' ')[1];
  
    jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
  
      const author_id = decoded.id; // Get the author's id from the decoded token
      const { title, content, category } = req.body;
      const image = req.file ? req.file.filename : null;
  
      const sql = `INSERT INTO posts (title, content, category, image, author_id) VALUES (?, ?, ?, ?, ?)`;
      const values = [title, content, category, image, author_id];
  
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error inserting post:', err);
          return res.status(500).json({ message: 'Failed to add post' });
        }
        res.status(200).json({ message: 'Post added successfully', postId: result.insertId });
      });
    });
  });

  
//   UPDATe
blogApp.put('/api/posts/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const tokenValue = token.split(' ')[1];
  
    jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
  
      const { title, content, category } = req.body;
      const newImage = req.file ? req.file.filename : null;
  
      // First fetch the current post to get existing image if needed
      const fetchQuery = `SELECT * FROM posts WHERE id = ?`;
      db.query(fetchQuery, [id], (err, results) => {
        if (err || results.length === 0) {
          return res.status(404).json({ message: "Post not found" });
        }
  
        const existingImage = results[0].image;
        const imageToUse = newImage || existingImage;
  
        const updateQuery = `
          UPDATE posts SET title = ?, content = ?, category = ?, image = ?
          WHERE id = ?
        `;
  
        db.query(updateQuery, [title, content, category, imageToUse, id], (err) => {
          if (err) {
            console.error("Update error:", err);
            return res.status(500).json({ message: "Failed to update post" });
          }
  
          res.json({ message: "Post updated successfully" });
        });
      });
    });
  });











// Get posts by logged-in user only// Get posts by logged-in user only
blogApp.get('/api/posts', (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const tokenValue = token.split(' ')[1];
  
    jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
  
      const author_id = decoded.id;
  
      const sql = `
        SELECT posts.id, posts.title, posts.content, posts.category, posts.image, posts.created_at, browserUser.name AS author 
        FROM posts
        JOIN browserUser ON posts.author_id = browserUser.id
        WHERE posts.author_id = ?
        ORDER BY posts.created_at DESC
      `;
  
      db.query(sql, [author_id], (err, results) => {
        if (err) {
          console.error('Error fetching posts:', err);
          return res.status(500).json({ message: 'Failed to fetch posts' });
        }
  
        res.status(200).json(results);
      });
    });
  });
  




// // Get all posts
// blogApp.get('/api/posts', (req, res) => {
//   db.query('SELECT * FROM posts ORDER BY created_at DESC', (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });

// Get a single post by ID (with author's name) (to author)
// also for read-blog (by a user)
blogApp.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    
    // Join posts with browserUser to get the author's name
    const query = `
      SELECT posts.*, browserUser.name AS author
      FROM posts
      JOIN browserUser ON posts.author_id = browserUser.id
      WHERE posts.id = ?
    `;
    
    db.query(query, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Post not found' });
  
      const post = results[0];
      post.imageUrl = post.image ? `http://localhost:5000/uploads/${post.image}` : null;
  
      res.json(post);
    });
  });
  
  





// Delete a post
blogApp.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Post deleted' });
  });
});














// browser side

// GET /api/blogs/category/:category
// Server-side (Node.js / Express)
// blogApp.get('/category/:category', (req, res) => {
//   const category = req.params.category;

//   const sql = 'SELECT * FROM posts WHERE category = ?';
//   db.query(sql, [category], (err, results) => {
//     if (err) {
//       console.error('Error fetching category blogs:', err);
//       return res.status(500).json({ error: 'Failed to fetch blogs by category' });
//     }
//     res.json(results);
//   });
// });
// Get posts by category and join with browserUser to get the author name
blogApp.get('/category/:category', (req, res) => {
  const category = req.params.category;

  const sql = `
    SELECT posts.*, browserUser.name AS author 
    FROM posts
    JOIN browserUser ON posts.author_id = browserUser.id
    WHERE posts.category = ?
  `;
  db.query(sql, [category], (err, results) => {
    if (err) {
      console.error('Error fetching category blogs:', err);
      return res.status(500).json({ error: 'Failed to fetch blogs by category' });
    }
    res.json(results);
  });
});




// Read blog
// up

// add comments
blogApp.post('/api/comments', (req, res) => {
  const { post_id, commenter_name, comment } = req.body;

  if (!comment || !post_id || !commenter_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO comments (post_id, commenter_name, comment) VALUES (?, ?, ?)';
  db.query(sql, [post_id, commenter_name, comment], (err, result) => {
    if (err) {
      console.error('Error adding comment:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(201).json({ message: 'Comment added successfully', commentId: result.insertId });
  });
});



// get comments
blogApp.get('/api/comments/:postId', (req, res) => {
  const { postId } = req.params;

  const sql = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC';
  db.query(sql, [postId], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
});



















blogApp.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
