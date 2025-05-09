/* Main container */
.category-blogs-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
    background-color: #f9f9f9;
  }
  
  /* Category title */
  .category-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    text-transform: capitalize;
  }
  
  /* Blog list container */
  .blog-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  /* Individual blog card */
  .blog-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: transform 0.3s ease-in-out;
  }
  
  .blog-card:hover {
    transform: translateY(-10px);
  }
  