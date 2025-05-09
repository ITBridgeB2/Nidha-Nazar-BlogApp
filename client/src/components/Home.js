import React from 'react';
import './css/Home.css';
import { useNavigate } from 'react-router-dom';

// images
import EducationImg from './images/education_img.jpg';
import FashionImg from './images/fashion_img.avif';
import FoodImg from './images/food_img.jpg';
import SportsImg from './images/sports_img.jpg';
import TravelImg from './images/travel_img.jpg';
import TechnologyImg from './images/tech_img.jpg';
import parentingImg from './images/parenting_img.jpg';
import HealthImg from './images/health_img.jpg';

const categories = [
  { name: 'Travel', imgSrc: TravelImg, description: 'Explore beautiful destinations around the world, from exotic beaches to cultural cities. Find travel tips and guides for your next adventure.' },
  { name: 'Food', imgSrc: FoodImg, description: 'Satisfy your taste buds with delicious recipes, restaurant recommendations, and food trends from around the globe.' },
  { name: 'Sports', imgSrc: SportsImg, description: 'Stay updated with the latest sports news, match analysis, and tips to improve your game.' },
  { name: 'Education', imgSrc: EducationImg, description: 'Discover educational articles, tips for students, and resources to help you succeed in academics.' },
  { name: 'Technology', imgSrc: TechnologyImg, description: 'Get the latest updates on tech trends, gadget reviews, and tutorials to stay ahead in the world of technology.' },
  { name: 'Parenting', imgSrc: parentingImg, description: 'Helpful parenting advice, tips on raising children, and strategies for managing family life.' },
  { name: 'Health', imgSrc: HealthImg, description: 'Learn about health tips, wellness routines, and expert advice on living a healthier and happier life.' },
  { name: 'Fashion', imgSrc: FashionImg, description: 'Stay updated with the latest fashion trends, style inspiration, and tips on how to look your best.' },
];

const Home = () => {
  const navigate = useNavigate();

  // Handle the category click to navigate
  const handleCategoryClick = (categoryName) => {
    navigate(`/blogs/${categoryName}`);
  };

  return (
    <div className="home-container">
      <div className="home-description">
        <p>
          Welcome to <strong>My Blog</strong> – your go-to platform to discover insightful content across a variety of topics! 
          Whether you're looking for travel guides, health tips, parenting advice, or the latest in technology, we've got you covered. 
          Browse through our well-curated categories and dive into articles written by passionate individuals from all walks of life.
        </p>
      </div>

      <h2 className="home-title">Explore Blog Categories</h2>
      <div className="catalog-grid">
        {categories.map((category) => (
          <div 
            key={category.name} 
            className="catalog-item"
            onClick={() => handleCategoryClick(category.name)} // Navigate on click
          >
            <img src={category.imgSrc} alt={category.name} />
            <h2 className="category-name">{category.name}</h2> {/* Category Name in H2 */}
            <p className="catalog-item-description">
    {category.description}  
  </p> {/* Category Description */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
