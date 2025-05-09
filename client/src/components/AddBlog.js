import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/AddBlog.css';
import { Filter } from 'bad-words'; // Import bad-words filter

function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const navigate = useNavigate();

  // Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const author = loggedInUser ? loggedInUser.username : 'Anonymous';

  // Create filter instance
  const filter = new Filter();

  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Filter bad words from title and content
    const filteredTitle = filter.clean(title);
    const filteredContent = filter.clean(content);
  
    // Validate fields before sending
    if (!filteredTitle || !filteredContent || !category) {
      alert('Please fill in all fields.');
      return;
    }
  
    const token = localStorage.getItem('jwtToken'); // Get the JWT from localStorage
  
    
console.log('JWT Token:', token);  // Log to verify if the token is being retrieved correctly

if (!token) {
  alert('No token found. Please log in again.');
  console.error('No token found');
  navigate('/login'); // Redirect to login page if no token
  return;
}
  
    // Create a FormData object to handle the image upload
    const formData = new FormData();
    formData.append('title', filteredTitle);
    formData.append('content', filteredContent);
    formData.append('category', category);
    formData.append('author', author); // You may not need this if you are getting it from the token
    if (image) formData.append('image', image);
  
    try {
      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // For file upload
        },
      });
      console.log('Post added successfully', response.data);
      navigate('/blog-list'); // Redirect to blog list page after success
    } catch (error) {
      if (error.response) {
        console.error('Error adding post:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Unable to add post.'}`);
      } else {
        console.error('Error adding post:', error.message);
        alert('Network error or server is not responding.');
      }
    }
  };
  

  return (
    <div className="add-blog-container">
      <form className="add-blog-form" onSubmit={handleSubmit}>
        <h2>Create New Post</h2>

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
          <option value="Sports">Sports</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
          <option value="Parenting">Parenting</option>
          <option value="Health">Health</option>
          <option value="Fashion">Fashion</option>
        </select>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}

        <button type="submit">Submit Post</button>
      </form>
    </div>
  );
}

export default AddBlog;
