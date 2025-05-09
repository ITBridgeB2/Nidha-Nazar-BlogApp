import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import './css/AddBlog.css';

function EditBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch blog data by ID
    axios.get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => {
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
        setCategory(post.category || '');
        setImagePreview(post.imageUrl); // Ensure your backend returns the correct image URL
      })
      .catch((err) => console.error("Failed to load post:", err));
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('No token found. Please log in.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/blog-list');
    } catch (err) {
      console.error("Failed to update post:", err);
      alert('Failed to update post.');
    }
  };

  return (
    <div className="add-blog-container">
      <form className="add-blog-form" onSubmit={handleSubmit}>
        <h2>Edit Post</h2>
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
        
        
        {/* Category */}
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: '100px', marginTop: '10px' }}
          />
        )}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditBlog;
