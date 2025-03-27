import React, { useState, useEffect } from "react";
import "./PopupModal.css";
import axios from "axios";
import * as urls from '../api.js'

const PopupModal = ({ isOpen, onClose, editItem }) => {
  const [dueAmount, setDueAmount] = useState(0);
  const [formData, setFormData] = useState(editItem || {});
  const [errorMessage,setErrorMessage]  = useState("")// Initial state

  // Update state when editItem changes
  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
      console.log(formData);
      
      setDueAmount(0);
    }
  }, [editItem]);

  if (!isOpen) return null; // Don't render if modal is closed

  const closeModal = () => {
    onClose();
    setErrorMessage("")
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dueAmount") {
      setDueAmount(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async() => {
    // onSave(formData);  // Uncomment if needed
     try{
        const sessionToken =  localStorage.getItem("sessionToken");
        const payload = {
            updateId : editItem._id,
            dueAmount,
            updateData:formData
        }
        await axios.post(urls.addDue, payload, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${sessionToken}`, // ✅ Correct format
            },
          });
         onClose(); // Close modal after saving
     }catch(err){
        setErrorMessage(err.message)
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
        <label className="mdlLbl">Loan Amount</label>
        <input
          type="text"
          name="loanAmount"
          value={formData.loanAmount || ""}
          readOnly
        />
        <label className="mdlLbl">Pending Amount</label>
        <input
          type="text"
          name="pendingAmount"
          value={formData.pendingAmount || 0}
          readOnly
        />
        <label className="mdlLbl">Due Amount</label>
        <input
          type="number"
          name="dueAmount"
          placeholder="Due Amount"
          value={dueAmount}
          onChange={handleChange}
        />
        <div className="modal-buttons">
          <button className="saveBtn" onClick={handleSave} disabled={Number(dueAmount)<=0 || Number(formData.pendingAmount)<=0} >
            Save
          </button>
          <button className="closeBtn" onClick={closeModal}>
            Cancel
          </button>
          {errorMessage && ( <p className="error-message"> {errorMessage ||"Something wrong couldn't update"}</p>)}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
