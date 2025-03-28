import React, { useState, useEffect } from "react";
import "./PopupModal.css";
import axios from "axios";
import * as urls from "../api.js";

const PopupModal = ({ isOpen, onClose, editItem }) => {
  const [dueAmount, setDueAmount] = useState(0);
  const [dueAddedDate, setDueAddedDate] = useState("");
  const [formData, setFormData] = useState(editItem || {});
  const [errorMessage, setErrorMessage] = useState(""); // Initial state

  // Update state when editItem changes
  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
      console.log(formData);

      setDueAmount(0);
      setDueAddedDate("");
    }
  }, [editItem]);

  if (!isOpen) return null; // Don't render if modal is closed

  const closeModal = () => {
    onClose();
    setErrorMessage("");
  };

  const handleChange = (e) => {
    setErrorMessage(""); // Reset error message on input change
    const { name, value } = e.target;
    if (name === "dueAmount") {
      if (value > formData.pendingAmount)
        setErrorMessage("Due amount can't be greater than pending amount");
      setDueAmount(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    // onSave(formData);  // Uncomment if needed
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      const payload = {
        updateId: editItem._id,
        dueAmount,
        updateData: formData,
      };

      if (dueAddedDate === "") {
        payload.dueAddedDate = new Date().toISOString();
      } else {
        payload.dueAddedDate = new Date(dueAddedDate).toISOString();
      }

      await axios.post(urls.addDue, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${sessionToken}`, // ✅ Correct format
        },
      });
      onClose();
      // Close modal after saving
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Due Amount</h2>
        <label className="mdlLbl">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
        />
        <label className="mdlLbl">Place</label>
        <input
          type="text"
          name="place"
          value={formData.place || ""}
          onChange={handleChange}
        />
        <label className="mdlLbl">Phone</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber || ""}
          onChange={handleChange}
        />
        <label className="mdlLbl">Pending Amount</label>
        <input
          type="text"
          name="pendingAmount"
          value={formData.pendingAmount || 0}
          readOnly
        />
        <label className="mdlLbl">date</label>
        <input
          type="date"
          name="dueAddedDate"
          value={dueAddedDate}
          onChange={(e) => setDueAddedDate(e.target.value)}
        />
        <label className="mdlLbl">Due Amount</label>
        <input
          type="number"
          name="dueAmount"
          className="dueAmountInput"
          placeholder="Add Due Amount Here.."
          // value={dueAmount}
          onChange={handleChange}
          onFocus={(e) => (e.target.value = dueAmount)}
          onBlur={(e) => (e.target.placeholder = "Add Due Amount Here..")}
        />
        {errorMessage && (
          <p className="error-message">
            {" "}
            {errorMessage || "Something wrong couldn't update"}
          </p>
        )}

        <div className="modal-buttons">
          <button
            className="saveBtn"
            onClick={handleSave}
            disabled={
              Number(dueAmount) <= 0 ||
              Number(formData.pendingAmount) <= 0 ||
              errorMessage
            }
          >
            Save
          </button>
          <button className="closeBtn" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
