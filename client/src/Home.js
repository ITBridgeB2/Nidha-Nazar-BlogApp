import React from 'react';
import './css/Home.css';

const categories = [
  'Travel',
  'Food',
  'Sports',
  'Education',
  'Technology',
  'Parenting',
  'Health',
  'Fashion',
];

const Home = () => {
    console.log('Home component rendered');
    return (
      <div className="home-container">
        <h2 className="home-title">Explore Blog Categories</h2>
        <div className="catalog-grid">
          {categories.map((category) => (
            <div className="catalog-item" key={category}>
              {category}
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default Home;
