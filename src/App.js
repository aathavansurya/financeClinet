import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import AddLoan from "./components/addLoan/Addloans";
import Loanstable from "./components/tableLoans/Loanstable";
import Profile from "./components/profile/Profile";
import History from "./components/histories/History";

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <Profile /> },
  { path: "/addloans", element: <AddLoan /> },
  { path: "/allLoans", element: <Loanstable /> },
  { path: "/histories", element: <History /> },
];

const App = () => (
  <Router>
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Map routes dynamically */}
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;
