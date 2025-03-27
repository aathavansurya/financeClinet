import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login.js";
import AddLoan from "./components/addLoan/Addloans.js";
import Loanstable from "./components/tableLoans/Loanstable.js";
import Profile from "./components/profile/Profile.js";
import History from "./components/histories/History.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addloans" element={<AddLoan />} />
        <Route path="/allLoans" element={<Loanstable />} />
        <Route path="/histories" element={<History />} />
        {/* Fallback route to handle undefined paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
