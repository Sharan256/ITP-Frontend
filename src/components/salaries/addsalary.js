import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import img from "../../img/black-black.jpg";

export default function SalaryForm() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trainerId: "",
    month: "",
    basicSalary: "",
    otHours: "",
    otRate: "",
    bonus: "",
  });
  const [trainerNames, setTrainerNames] = useState([]);

  useEffect(() => {
    // Fetch trainer names and IDs from the server
    const fetchTrainerData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/users/trainer"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trainer data");
        }
        const data = await response.json();
        // Extract trainer names and IDs from the data
        const trainers = data.map((trainer) => ({
          id: trainer._id,
          name: trainer.username,
        }));
        setTrainerNames(trainers);
      } catch (error) {
        console.error("Error fetching trainer data:", error.message);
        toast.error("Failed to fetch trainer data");
      }
    };

    fetchTrainerData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { trainerId, month, basicSalary, otHours, otRate, bonus } = formData;
    const otTotal = otHours * otRate;
    const totalSalary = Number(basicSalary) + otTotal + Number(bonus);
    console.log(
      trainerId,
      month,
      basicSalary,
      otHours,
      otRate,
      bonus,
      totalSalary
    );
    try {
      // Perform API call to save salary data
      const response = await fetch("http://localhost:5000/api/salaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainerId,
          month,
          basicSalary,
          otHours,
          otRate,
          bonus,
          totalSalary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add salary");
      }

      toast.success("Salary added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to salary list page after successful addition
      setTimeout(() => {
        navigate("/salary-view", { state: { user } });
      }, 3000);
    } catch (error) {
      console.error("Error adding salary:", error.message);
      toast.error(error.message || "Failed to add salary!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

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
          height: "1000px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div
        className="container box3 mt-3 "
        style={{ width: "600px", padding: "35px" }}
      >
        <h4 className="text-warning text-center">Add Salary</h4>
        <div className="underline1 bg-warning w-100"></div>
        <form className="mt-4 p-5 w-100" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="trainerId" className="form-label text-warning">
              Trainer
            </label>
            <select
              className="form-select"
              id="trainerId"
              name="trainerId"
              value={formData.trainerId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select trainer</option>
              {trainerNames.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="month" className="form-label text-warning">
              Month
            </label>
            <input
              type="text"
              className="form-control"
              id="month"
              placeholder="Enter month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="basicSalary" className="form-label text-warning">
              Basic Salary
            </label>
            <input
              type="number"
              className="form-control"
              id="basicSalary"
              placeholder="Enter basic salary"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="otHours" className="form-label text-warning">
              OT Hours
            </label>
            <input
              type="number"
              className="form-control"
              id="otHours"
              placeholder="Enter OT hours"
              name="otHours"
              value={formData.otHours}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="otRate" className="form-label text-warning">
              OT Rate
            </label>
            <input
              type="number"
              className="form-control"
              id="otRate"
              placeholder="Enter OT rate"
              name="otRate"
              value={formData.otRate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bonus" className="form-label text-warning">
              Bonus
            </label>
            <input
              type="number"
              className="form-control"
              id="bonus"
              placeholder="Enter bonus"
              name="bonus"
              value={formData.bonus}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="d-flex">
            <button
              className="btn btn-warning"
              style={{ marginRight: "252px" }}
            >
              ADD SALARY
            </button>
            <ToastContainer />
            <button
              className="btn btn-warning"
              onClick={() => navigate("/salary-view", { state: { user } })}
            >
              BACK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
