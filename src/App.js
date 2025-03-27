import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login.js";
import AddLoan from "./components/addLoan/Addloans.js";
import Loanstable from "./components/tableLoans/Loanstable.js";
import Profile from "./components/profile/Profile.js";
import History from "./components/histories/History.js";
const App = () => {
  return (
    <Router> {/* ✅ Wrap the whole Routes inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addloans" element={<AddLoan />} />
        <Route path="/allLoans" element={<Loanstable />} />
        <Route path="/histories" element={<History />} />
      </Routes>
    </Router>
  );
};

export default App;
