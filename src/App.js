import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import AddLoan from "./components/addLoan/Addloans";
import Loanstable from "./components/tableLoans/Loanstable";
import Profile from "./components/profile/Profile";
import History from "./components/histories/History";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define all routes */}
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addloans" element={<AddLoan />} />
        <Route path="/allLoans" element={<Loanstable />} />
        <Route path="/histories" element={<History />} />
        {/* Fallback route to handle undefined paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;