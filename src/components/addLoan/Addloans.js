import React , {useEffect,useState} from 'react'
import { useNavigate } from "react-router-dom";
import './loan.css'
import * as urls from '../api.js'
import NavBar from '../dashboard/navBar/NavBar'
import axios from 'axios';

function AddLoan() {
    const navigate = useNavigate(); // ✅ Hook for navigation
    const [sessionToken, setSessionToken] = useState("");
    let sessionTokenvalue;
    useEffect(() => {
        sessionTokenvalue  = localStorage.getItem('sessionToken') 
      if (sessionTokenvalue) {
        setSessionToken(sessionTokenvalue)
        console.log('Session token found:', sessionToken);
        // You can navigate the user to the dashboard if needed
      }else{
         navigate('/login')
      }
    }, []);
    const [formData, setFormData] = useState({
        name: "",
        loanAmount: "",
        place: "",
        contactNumber: "",
        dueAmount:""
      });
    
      const [isSubmitted, setIsSubmitted] = useState(false);
      const [validPhone, setValidPhone] = useState(true); // ✅ Use useState to track

    
      // Check if all fields are filled
      let isFormValid = Object.values(formData).every((field) => String(field).trim() !== "");
      if(isFormValid){
        isFormValid = formData.contactNumber.length === 10
      }

      // Handle Input Changes
      const handleChange = (e) => {
          
          setFormData({ ...formData, [e.target.name]: e.target.value });
          if(e.target.name === "contactNumber") {
            setValidPhone(e.target.value.length >=10);
          }
          console.log((formData.loanAmount!==""&&formData.dueAmount!=="")&& (Number(formData.loanAmount) < Number(formData.dueAmount)));
          
      };
    
      // API Call on Submit
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // if (!isFormValid) return; // Prevent submission if fields are empty
        console.log(sessionToken);
        
    
        try {
          formData.status = true;
          console.log(formData);
          
          const response = await axios.post(urls.addLoans, formData, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${sessionToken}`, // ✅ Correct format
            },
          });
    
          if (response.data.status === 200) {
            setIsSubmitted(true);
            setTimeout(()=>{
                setIsSubmitted(false)
            },1000);
            setFormData({
                name: "",
                loanAmount: "",
                place: "",
                contactNumber: "",
                dueAmount:""
              })
            // alert("Loan Added Successfully!");
          } else {
            // alert("Failed to add loan!");
          }
        } catch (error) {
          console.error("API Error:", error);
          alert("Something went wrong!");
        }
      };
  return (
    <div>
    <div className='navBarHeight'><NavBar/></div> 
      <div className='addLoanBg'>
      <div className="form-container">
      <h2>Add Loan</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="loanAmount" placeholder="Loan Amount" value={formData.loanAmount} onChange={handleChange} required />
        <input type="number" name="dueAmount" placeholder="Due Amount" value={formData.dueAmount} onChange={handleChange} required />
        {(formData.loanAmount!==""&&formData.dueAmount!=="")&& (Number(formData.loanAmount) < Number(formData.dueAmount)) && (
          <p className="error-message">Due amount should be less than loan amount</p>
        )}
        <input type="text" name="place" placeholder="Place" value={formData.place} onChange={handleChange} required />
        <input type="number" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required />
        <button type="submit" disabled={!isFormValid}>Submit</button>
      </form>

      {isSubmitted && <p className="success-message">Loan Added Successfully! ✅</p>}
      {!validPhone && formData.contactNumber.length > 0 && (
          <p className="error-message">Invalid Phone Number (must be 10 digits)</p>
        )}    </div>
      </div>
    </div>
  )
}

export default AddLoan
