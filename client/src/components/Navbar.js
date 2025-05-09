// Navbar.js
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Navbar.css';

import { AuthContext } from './AuthContext';

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  

  // // Check login status when the component mounts
  // useEffect(() => {
  //   const token = localStorage.getItem('jwtToken');
  //   setIsLoggedIn(!!token);  // Set the login status based on token
  // }, []); // Runs once on component mount

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);  // Set logged-in status to false
    navigate('/');  // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-left"></div>
      <div className="navbar-center">My Blog</div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <button  className="nav-button" onClick={handleLogout}>Logout</button>
        ) : (
          <>
          <a href='/'>Home</a>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
