import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './css/PostDetail.css';

// Helper function to format the date correctly
const formatDate = (date) => {
  const postDate = new Date(date);
  if (isNaN(postDate.getTime())) {
    return 'Invalid Date'; // Return a fallback if the date is invalid
  }
  return postDate.toLocaleDateString(); // Format the date properly
};

const PostDetail = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post details from backend
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error('Error fetching post:', err));
  }, [id]);

  if (!post) return <div className="text-center mt-10">Loading...</div>;

  // Format the post date using the helper function
//   const formattedDate = formatDate(post.date);

  const handleDelete = () => {
    // Delete post request
    fetch(`http://localhost:5000/api/posts/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Navigate back to the post list after deleting
        navigate('/');
      })
      .catch((err) => console.error('Error deleting post:', err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4 text-center">
          By: {post.author} | Date: {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex justify-center gap-6 mb-6">
          <Link to={`/edit/${id}`} className="edit-btn">
            Edit Post
          </Link>
          <button onClick={handleDelete} className="delete-btn">
            Delete Post
          </button>
        </div>
        <button
          className="back-btn"
          onClick={() => navigate('/')}
        >
          &larr; Back to Post List
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
