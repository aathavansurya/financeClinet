import React, { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as urls from '../api.js';
import axios from "axios";

import NavBar from "../dashboard/navBar/NavBar";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const [decodedData, setDecodedData] = useState({});
  const [user, setUser] = useState({ name: "", email: "" });
  const [editable, setEditable] = useState({ name: false, email: false });
  const [isChanged, setIsChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    console.log("refereshed");
    
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      const decoded = jwtDecode(sessionToken);
      setDecodedData(decoded);
      setUser({ name: decoded.userName, email: decoded.email });
    } else {
      navigate("/login");
    }
  }, [navigate, update]);

  const handleEdit = (field) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
    if (!editable[field]) {
      setUser((prev) => ({ ...prev, [field]: decodedData[field === "name" ? "userName" : "email"] }));
    }
  };

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setIsChanged(true);
  };

  const handleSave = async () => {
    if (!isChanged) return;

    try {
      const sessionToken = localStorage.getItem("sessionToken");
      const payload = { name: user.name, email: user.email };
      const response = await axios.post(urls.updateProfile, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      localStorage.setItem("sessionToken", response.data.body.jwt);
      setUpdate((prev) => !prev);
    } catch (err) {
      console.error(err);
       setUpdate((prev) => !prev);
      setIsError(err.response?.data?.message || "An error occurred");
      setTimeout(() => setIsError(""), 2000);
    }
  };

  const handleAddPerson = async () => {
    setIsModalOpen(false);
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      const payload = { name: newPerson.name, email: newPerson.email, password: newPerson.password };
      await axios.post(urls.addProfile, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 1000);
    } catch (err) {
      console.error(err);
      setIsError(err.response?.data?.message || "An error occurred");
      setTimeout(() => setIsError(""), 2000);
    }
  };

  const handleNewPersonChange = (e) => {
    setNewPerson((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <NavBar />
      <div className="d-flex justify-content-center align-items-center mainContainer">
        <div className="profile-container">
          <h2 className="title">Profile</h2>
          {isSubmitted && <p className="success-message">Profile updated Successfully! ✅</p>}
          {isError && <p className="error-message">{isError}</p>}
          {["name", "email"].map((field) => (
            <div className="field-container" key={field}>
              <input
                name={field}
                value={user[field]}
                onChange={handleChange}
                disabled={!editable[field]}
                className="input-field"
              />
              <Pencil className="edit-icon" onClick={() => handleEdit(field)} />
            </div>
          ))}
          <button onClick={handleSave} disabled={!isChanged} className="save-button">
            Save Changes
          </button>
          <button onClick={() => setIsModalOpen(true)} className="add-button">
            <Plus className="plus-icon" /> Add More People
          </button>
          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Add New Person</h3>
                {["name", "email", "password"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    type={field === "password" && !showPassword ? "password" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    onChange={handleNewPersonChange}
                    className="modal-input"
                  />
                ))}
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                  <label htmlFor="showPassword">Show Password</label>
                </div>
                <button onClick={handleAddPerson} className="modal-button">
                  Add Person
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;