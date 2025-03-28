import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './navbar.css';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const logout = (value) => {
    if (value === 'login') localStorage.removeItem('sessionToken');
    navigate(`/${value}`);
  };

  const isActive = (path) => location.pathname === `/${path}` ? 'active' : ''; // Check if the path is active

  return (
    <div>
      <nav className='navBar'>
        <div className={`navbtn ${isActive('profile')}`} onClick={() => logout('profile')}>Profile</div>
        <div className={`navbtn ${isActive('addloans')}`} onClick={() => logout('addloans')}>Add Loans</div>
        <div className={`navbtn ${isActive('allLoans')}`} onClick={() => logout('allLoans')}>All Loans</div>
        <div className={`navbtn ${isActive('histories')}`} onClick={() => logout('histories')}>History</div>
        <div className={`navbtn signOut ${isActive('login')}`} onClick={() => logout('login')}>SignOut</div>
      </nav>
    </div>
  );
}

export default NavBar;