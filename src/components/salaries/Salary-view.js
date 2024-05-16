import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img from "../../img/back.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function SalaryView() {
  const [salaries, setSalaries] = useState([]);
  const [trainerNames, setTrainerNames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  const location = useLocation();
  const { user } = location.state || {};
  const history = useNavigate();

  useEffect(() => {
    fetchSalaries();
    fetchTrainerNames();
  }, []);

  const handlePrintButtonClick = () => {
    // Initialize jsPDF instance
    const doc = new jsPDF();

    // Add a title to the PDF document
    doc.text("Salaries Report", 10, 10);

    // Extract table data from the state
    const data = salaries.map((salary) => [
      trainerNames[salary.trainer] || "Loading...",
      salary.month,
      salary.basicSalary,
      salary.otHours,
      salary.otRate,
      salary.bonus,
      salary.totalSalary,
    ]);

    // Define columns for the table
    const columns = [
      "Trainer",
      "Month",
      "Basic Salary",
      "OT Hours",
      "OT Rate",
      "Bonus",
      "Total Salary",
    ];

    // Add table to the PDF document
    doc.autoTable({
      head: [columns],
      body: data,
    });

    // Save the PDF document
    doc.save("salaries_report.pdf");
  };

  const fetchSalaries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/salaries/");
      if (!response.ok) {
        throw new Error("Failed to fetch salaries");
      }
      const data = await response.json();
      setSalaries(data);
    } catch (error) {
      console.error("Error fetching salaries:", error.message);
      toast.error("Failed to fetch salaries");
    }
  };

  const fetchTrainerNames = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/users/trainer"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trainer names");
      }
      const data = await response.json();
      // Create a mapping of trainer ID to name
      const namesMap = {};
      data.forEach((trainer) => {
        namesMap[trainer._id] = trainer.username;
      });
      setTrainerNames(namesMap);
    } catch (error) {
      console.error("Error fetching trainer names:", error.message);
      toast.error("Failed to fetch trainer names");
    }
  };

  const deleteSalary = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/salaries/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete salary");
      }
      toast.success("Salary deleted successfully");
      fetchSalaries(); // Refetch salaries after deletion
    } catch (error) {
      console.error("Error deleting salary:", error.message);
      toast.error("Failed to delete salary");
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  const filteredSalaries = salaries.filter((salary) =>
    trainerNames[salary.trainer]
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const sortedSalaries =
    sortOption === "asc"
      ? filteredSalaries.sort((a, b) => a.totalSalary - b.totalSalary)
      : sortOption === "desc"
      ? filteredSalaries.sort((a, b) => b.totalSalary - a.totalSalary)
      : filteredSalaries;

  return (
    <div>
      <Navbar />
      <img
        src={img}
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "850px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div
        className="container mt-3 "
        style={{ width: "1000px", padding: "35px" }}
      >
        <h4 className="text-warning text-center">Salaries</h4>
        <div className="underline1 bg-warning w-100"></div>
        <br></br>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <select
              value={sortOption}
              onChange={handleSort}
              className="form-select"
            >
              <option value="">Sort by total salary</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="bg-warning">
              <tr>
                <th>Trainer</th>
                <th>Month</th>
                <th>Basic Salary</th>
                <th>OT Hours</th>
                <th>OT Rate</th>
                <th>Bonus</th>
                <th>Total Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="box3">
              {sortedSalaries.map((salary) => (
                <tr key={salary._id}>
                  <td className="text-warning">
                    {trainerNames[salary.trainer] || "Loading..."}
                  </td>
                  <td className="text-warning">{salary.month}</td>
                  <td className="text-warning">{salary.basicSalary}</td>
                  <td className="text-warning">{salary.otHours}</td>
                  <td className="text-warning">{salary.otRate}</td>
                  <td className="text-warning">{salary.bonus}</td>
                  <td className="text-warning">{salary.totalSalary}</td>
                  <td>
                    <button
                      style={{ marginRight: "10px" }}
                      className="btn btn-warning"
                      onClick={() => deleteSalary(salary._id)}
                    >
                      Delete
                    </button>
                    {/* Add edit button and route */}
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        history(`/edit-salary`, {
                          state: { user, salaryData: salary },
                        })
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-center">
          <button
            className="btn btn-warning"
            style={{ marginRight: "242px" }}
            onClick={() => history("/salary-add", { state: { user } })}
          >
            ADD SALARY
          </button>

          <button
            className="btn btn-warning"
            style={{ marginRight: "10px" }}
            onClick={handlePrintButtonClick}
          >
            Print
          </button>
          {/* Other buttons */}

          <button
            className="btn btn-warning"
            onClick={() => history("/admin-home", { state: { user } })}
          >
            Back
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
