import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/CategoryBlogs.js'; // Import the styling file
import { Link } from 'react-router-dom';

const CategoryBlogs = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/category/${category}`);
        const data = await response.json();
        
        console.log(data);
        if (Array.isArray(data)) {
          setBlogs(data); // Update the state with the fetched data
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [category]);

  return (
    <div className="category-blogs-container">
      <h2 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)} Blogs</h2>
      <div className="blog-list">
        {blogs.length > 0 ? (
          blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-author">By {blog.author}</p>
              <p className="blog-excerpt">{blog.content.slice(0, 100)}...</p>
              <Link to={`/blog/${blog.id}`} className="read-more">
                Read More
              </Link>
            </div>
          ))
        ) : (
          <p className="no-blogs-message">No blogs found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryBlogs;
