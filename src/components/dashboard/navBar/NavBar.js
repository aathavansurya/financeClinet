import React from 'react'
import { useNavigate } from "react-router-dom";

import './navbar.css'
function NavBar() {
    const navigate = useNavigate()
   const logout =(value) =>{
    if(value === "login")localStorage.removeItem('sessionToken');
    navigate(`/${value}`)



   }

  return (
    <div>
      <nav className='navBar'>
           <div className='navbtn' onClick={()=>logout("profile")}>Profile</div>
           <div className='navbtn' onClick={()=>logout("addloans")}>add Loans</div>
           <div className='navbtn' onClick={()=>logout("allLoans")}>all Loans</div>
           <div className='navbtn' onClick={()=>logout("histories")}>History</div>
           <div className='navbtn signOut' onClick={()=>logout("login")}>SignOut</div>
      </nav>
    </div>
  )
}

export default NavBar
