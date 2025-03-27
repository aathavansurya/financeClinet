import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tableLoans.css";
import * as urls from "../api.js";
import NavBar from "../dashboard/navBar/NavBar";
import PopupModal from "../popupModal/DueEdit.js";
import axios from "axios";

function Loanstable() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [mainloans, setMainloans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [removeFilters, setRemoveFilters] = useState(false);
  
  const [editItem, setEditItem] = useState();
  const [filters, setFilters] = useState({
    name: "",
    contactNumber: "",
    place: "",
  });
  const [dropdownData, setDropdownData] = useState({
    names: [],
    contactNumbers: [],
    places: [],
  });
  const [sessionToken, setSessionToken] = useState("");

  // Fetch loans and dropdown data
  const fetchLoans = async (sessionToken) => {
    try {
      const fetchData = await axios.post(
        urls.fetchLoans,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      const sampleData = fetchData.data.body.results;
      setLoans(sampleData);
      setMainloans(sampleData)
      setFilteredLoans(sampleData);

      // Extract unique dropdown values
      const names = [...new Set(sampleData.map((loan) => loan.name))];
      const contactNumbers = [...new Set(sampleData.map((loan) => loan.contactNumber))];
      const places = [...new Set(sampleData.map((loan) => loan.place))];

      setDropdownData({ names, contactNumbers, places });
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      setSessionToken(sessionToken);
      fetchLoans(sessionToken);
    } else {
      navigate("/login");
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  function handleRemoveFilter(){
    setFilters({
      name: "",
      contactNumber: "",
      place: "",
    });
    setRemoveFilters(false);
    setFilteredLoans(loans);
  }
  // Apply filters on button click
  const handleApplyFilters = () => {
    // const checkFilters
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== "")
    );
    if (Object.keys(validFilters).length > 0) {
      const newFilteredLoans = loans.filter((loan) =>{
        console.log({loan});
        
      return (filters.name === "" || loan.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.contactNumber === "" || loan.contactNumber.includes(filters.contactNumber)) &&
      (filters.place === "" || loan.place.toLowerCase().includes(filters.place.toLowerCase()))
    }
    );
    setFilteredLoans(newFilteredLoans);
    setRemoveFilters(true)
    }else{
      setRemoveFilters(false);
      setFilteredLoans(loans);
    }

  };

  // Open modal for editing
  const openModal = (item) => {
    setIsModalOpen(true);
    setEditItem(item);
  };

  return (
    <div>
      <div className="navBarHeight">
        <NavBar />
      </div>
      <div className="addLoanBg mainContainer">
        <div className="table-container">
          <h2>Loan Records</h2>

          {/* Filters */}
          <div className="filter-container">
            {/* Name Filter with Dropdown */}
            <input
              type="text"
              name="name"
              placeholder="Filter by Name"
              value={filters.name}
              onChange={handleFilterChange}
              list="name-options"
            />
            <datalist id="name-options">
              {dropdownData.names.map((name, index) => (
                <option key={index} value={name} />
              ))}
            </datalist>

            {/* Contact Number Filter with Dropdown */}
            <input
              type="text"
              name="contactNumber"
              placeholder="Filter by Contact Number"
              value={filters.contactNumber}
              onChange={handleFilterChange}
              list="contact-options"
            />

            {/* Place Filter with Dropdown */}
            <input
              type="text"
              name="place"
              placeholder="Filter by Place"
              value={filters.place}
              onChange={handleFilterChange}
              list="place-options"
            />

            {/* Apply Filters Button */}
            <button onClick={handleApplyFilters} className="apply-filters-button filterBtn ">
              Apply Filters
            </button>
            {removeFilters && (    <button onClick={handleRemoveFilter} className="apply-filters-button filterBtn rmvFltr">
              Remove Filters
            </button>)}
          </div>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className="dktpView">Place</th>
                <th className="dktpView">Loan Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan._id}>
                    <td className="dktpView">{loan.name}</td>
                    <td className="mobileView">
                      {loan.name} <br /> {loan.place} <br />
                      {loan.loanAmount}
                    </td>
                    <td className="dktpView">{loan.place}</td>
                    <td className="dktpView">{loan.loanAmount}</td>
                    <td>
                      <button
                        className="editBtn"
                        onClick={() => openModal(loan)}
                      >
                        {Number(loan.pendingAmount) > 0 ? "Add due" : "Completed"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editItem={editItem}
      />
    </div>
  );
}

export default Loanstable;