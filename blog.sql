-- BLOG APP

CREATE TABLE IF NOT EXISTS browserUser (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM browserUser;

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,  -- Foreign Key to the users table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255) DEFAULT NULL,
    category VARCHAR(100) NOT NULL,  -- Add the category field
    FOREIGN KEY (author_id) REFERENCES browserUser(id)  -- Reference to the users table
);

SELECT * FROM posts;
SELECT DISTINCT category FROM posts;


-- for storing comments
CREATE TABLE comments (
	id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
	commenter_name VARCHAR(100),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

