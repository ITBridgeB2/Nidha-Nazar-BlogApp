import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/ReadBlog.css';

const ReadBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commenterName, setCommenterName] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        const data = await response.json();
        setBlog(data);

        const commentsResponse = await fetch(`http://localhost:5000/api/comments/${id}`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        } else {
          console.error('Error fetching comments:', commentsResponse);
        }
      } catch (error) {
        console.error('Error fetching blog or comments:', error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: id,
          commenter_name: commenterName,
          comment: newComment,
        }),
      });

      if (response.ok) {
        const commentsResponse = await fetch(`http://localhost:5000/api/comments/${id}`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
        setCommenterName('');
        setNewComment('');
        setShowCommentForm(false);
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="blog-details-container">
      {blog ? (
        <>
          <h2 className="blog-title">{blog.title}</h2>
          <p className="blog-author">By : {blog.author}</p>

            {/* Display Image if available */}
          {blog.image && (
            <div className="blog-image">
              <img src={`http://localhost:5000/uploads/${blog.image}`} width={740} height={400} alt={blog.title} />
            </div>
          )}


          <p className="blog-content">{blog.content}</p>

          
          <div className="comments-section">
            <h3>Comments</h3>
            <div className="comment-list">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <strong>{comment.commenter_name}</strong>
                    <p>{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            <button
              className="add-comment-btn"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              {showCommentForm ? 'Cancel' : 'Add Comment'}
            </button>

            {showCommentForm && (
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <input
                  type="text"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  placeholder="Your name"
                  required
                />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  required
                ></textarea>
                <button type="submit">Submit Comment</button>
              </form>
            )}
          </div>
        </>
      ) : (
        <p>Loading blog details...</p>
      )}
    </div>
  );
};

export default ReadBlog;
