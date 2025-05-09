import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/BlogList.css";

function BlogList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // or whatever key you used

    axios
      .get("http://localhost:5000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPosts(res.data);  // Directly set the posts without filtering
        } else {
          console.error("Unexpected response format:", res.data);
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
      });
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <div className="blog-page">
      <h1 className="blog-heading">Blog Posts</h1>
      <div className="blog-create-link">
        <Link to="/add-blog">Create New Post</Link>
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => navigate(`/blog-detail/${post.id}`)}
          className="blog-post"
        >
          <h2>{post.title}</h2>
          <p>{post.content.slice(0, 40)}...</p>
          <p className="post-meta">
            By:{" "}
            {post.author ||
              JSON.parse(localStorage.getItem("user"))?.username ||
              "Anonymous"}{" "}
            | Date: {new Date(post.created_at).toLocaleDateString()}
          </p>
          <div className="post-actions">
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-blog/${post.id}`);
              }}
              className="edit-link"
            >
              Edit
            </span>
            <span
              onClick={(e) => handleDelete(post.id, e)}
              className="delete-link"
            >
              Delete
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlogList;
