import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./history.css";
import * as url from "../api.js";
import axios from "axios";
import NavBar from "../dashboard/navBar/NavBar.js";

const History = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [historyData, setHistoryData] = useState([]);
  const [mainDate, setMainDate] = useState([]);
  const [removeFilters, setRemoveFilters] = useState(false);
  const [filters, setFilters] = useState({
    financier: "",
    user: "",
    stdate: "",
    enddate: "",
  });

  // Fetch data with optional filters
  const fetchData = async (sessionToken) => {
    try {
      const response = await axios.post(url.fetchHistories, filters, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`, // ✅ Correct format
        },
      });

      setHistoryData(response.data.body.results);
      setMainDate(response.data.body.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      fetchData(sessionToken);
    } else {
      navigate("/login");
    }
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  function handleRemoveFilter(){
    setFilters({ financier: "", user: "", stdate: "", enddate: "" });
    setRemoveFilters(false);
    setHistoryData(mainDate);
  }
  const handleFilterApply = () => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) return;
  
    // Extract valid filters (non-empty values)
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== "")
    );
  
    if (Object.keys(validFilters).length > 0) {
      // Filter existing data locally
      const filteredData = mainDate.filter((item) => {
        const matchesFinancier = validFilters.financier
          ? item.authorName.toLowerCase().includes(validFilters.financier.toLowerCase())
          : true;
  
        const matchesUser = validFilters.user
          ? item.loanerName.toLowerCase().includes(validFilters.user.toLowerCase())
          : true;
  
        const matchesStartDate = validFilters.stdate
          ? new Date(item.createAt).setHours(0, 0, 0, 0) >= new Date(validFilters.stdate).setHours(0, 0, 0, 0)
          : true;
  
        const matchesEndDate = validFilters.enddate
          ? new Date(item.createAt).setHours(0, 0, 0, 0) <= new Date(validFilters.enddate).setHours(0, 0, 0, 0)
          : true;
  
        return matchesFinancier && matchesUser && matchesStartDate && matchesEndDate;
      });
  
      setHistoryData(filteredData);
      setRemoveFilters(true);
    } else {
      // If no filters are applied, fetch all data again
      setHistoryData(mainDate);
      setRemoveFilters(false);
    }
  };


  return (
    <div>
      <div className="navBarHeight overflow-x-auto mt-16">
        <NavBar />
      </div>

      {/* Filters Section */}
      <div className="filterContainer p-4 bg-gray-100 rounded-md shadow-md flex flex-col md:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          name="financier"
          placeholder="Financier"
          value={filters.financier}
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full md:w-1/4"
        />
        <input
          type="text"
          name="user"
          placeholder="User"
          value={filters.user}
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full md:w-1/4"
        />
        <input
          type="text" // Initially set to "text" to show the placeholder
          name="stdate"
          placeholder="Start Date" // Placeholder text
          value={filters.stdate}
          onFocus={(e) => (e.target.type = "date")} // Change to "date" on focus
          onBlur={(e) => (e.target.type = "text")} // Revert to "text" on blur if no value is selected
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full md:w-1/4"
        />
        <input
          type="text" // Initially set to "text" to show the placeholder
          name="enddate"
          placeholder="End Date" // Placeholder text
          value={filters.enddate}
          onFocus={(e) => (e.target.type = "date")} // Change to "date" on focus
          onBlur={(e) => (e.target.type = "text")} // Revert to "text" on blur if no value is selected
          onChange={handleFilterChange}
          className="p-2 border rounded-md w-full md:w-1/4"
        />
        <button
          onClick={handleFilterApply}
          className="bg-blue-600 text-black px-4 py-2 rounded-md hover:bg-blue-700 filterBtn" 
        >
          Apply Filters
        </button>
        {removeFilters && (<button 
          onClick={handleRemoveFilter}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 rmvFltr filterBtn"
        >
          Remove Filters
        </button>)}
      </div>

      <div className="overflow-x-auto mainContainer mt-4">
        <table className="hidden md:table w-full border border-gray-200 desktop">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Financier</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">PaidDue</th>
              <th className="p-3 text-left">PendingAmount</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-blue-50">
                <td className="p-3">{item.authorName}</td>
                <td className="p-3">{item.loanerName}</td>
                <td className="p-3">{item.paidDue}</td>
                <td className="p-3">{item.pendingAmount}</td>
                <td className="p-3">{item.createAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View: Stack items */}
        <div className="md:hidden mobile ">
          {historyData.map((item) => (
            <div
              key={item.id}
              className="border p-3 mb-2 shadow-lg rounded-md bg-white mobItem"
            >
              <p>
                <strong>Financier:</strong> {item.authorName}
              </p>
              <p>
                <strong>User:</strong> {item.loanerName}
              </p>
              <p>
                <strong>PaidDue:</strong> {item.paidDue}
              </p>
              <p>
                <strong>PendingAmount:</strong> {item.pendingAmount}
              </p>
              <p>
                <strong>Date:</strong> {item.createAt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
