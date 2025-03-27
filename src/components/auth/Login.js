import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios'
import './Login.css';
import { TbBrandCashapp } from "react-icons/tb";
// import * as urls from '../api'
const Login = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation

  // State to store username, password, password visibility, and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check localStorage for sessionToken on page load
  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    console.log({sessionToken});
    
    if (sessionToken) {
      console.log('Session token found:', sessionToken);
      navigate('/addloans')
      // You can navigate the user to the dashboard if needed
    }
  }, []);

  // Enable/Disable button based on input fields
  useEffect(() => {
    setErrorMessage("")
    if (username.trim() && password.trim()) {
      setIsButtonDisabled(false);
      setErrorMessage('');
    } else {
      setIsButtonDisabled(true);
    }
  }, [username, password]);

  // Handle button click when disabled
  const url = " http://localhost:3400"
  const handleButtonClick = async (e) => {
    try{
        e.preventDefault();
        console.log(username,password,url);
        
       const response = await axios.post(url+'/login',{userName:username,password});
       console.log(response.data);
       if(response.data.status === 200){
        setLoginSuccess(true);
        setTimeout(()=>{
            setLoginSuccess(false);
        },1000)
        setUsername("");
        setPassword("");

        localStorage.setItem("sessionToken",response.data.body.jwt)
        navigate('/profile')

        
       }
       
       return                                                                                                                                   

    }catch(err){
        console.log(err.response.data.message);
        if(err?.response?.data?.message){
            setErrorMessage(err?.response?.data?.message)
        }else{
            setErrorMessage(err)
        }
        
    }
  };

  return (
    <div className="login-bg">
      {/* Heading Section - Always on top for mobile */}
      <div className="heading-section">
        <h2 className="heading-text">Welcome to Finance App</h2>
      </div>

      <div className="login-container">
        {/* Logo Section */}
        <div className="heading">
          <div className="icon">
            <TbBrandCashapp />
          </div>
          <span className="title mb-0">Finance</span>
        </div>

        {/* Form Section */}
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="id" className="label">Username</label>
            <input 
              type="text" 
              id="id" 
              className="input" 
              placeholder="Enter username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="label">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              className="input" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {/* Show Password Checkbox */}
            <div className="show-password">
              <input 
                type="checkbox" 
                id="showPassword" 
                checked={showPassword} 
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {loginSuccess && <p className="success-message">Login SuccessFull</p>}

          <button 
            className="login-btn" 
            disabled={isButtonDisabled} 
            onClick={handleButtonClick}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
