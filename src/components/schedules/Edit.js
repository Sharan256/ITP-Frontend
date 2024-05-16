import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../UserNavbar";
import img5 from "../../img/back.jpg";

export default function EditClass() {
  const location = useLocation();
  const { user, trainer } = location.state || {};
  const navigate = useNavigate();

  const [inputData, setInputData] = useState({
    className: "",
    instructor: "",
    time: "",
    location: "",
    date: "", // New date field
    userId: user._id || "",
  });

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trainers");
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error.message);
      }
    };

    fetchInstructors();

    // Pre-fill input fields with existing data
    if (trainer) {
      setInputData(trainer);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    // Check if the selected date is not in the past
    if (selectedDate >= currentDate) {
      setInputData({ ...inputData, date: selectedDate });
    } else {
      // Display error or notify user that past dates cannot be selected
      toast.error("Past dates cannot be scheduled!", {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { className, instructor, time, location, date, userId } = inputData;

    try {
      const response = await fetch(
        `http://localhost:5000/api/schedules/${trainer._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            className,
            instructor,
            time,
            location,
            date,
            userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update class");
      }

      toast.success("Class updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/trainer-user-view", { state: { user } });
      }, 3000);
    } catch (error) {
      console.error("Error updating class:", error.message);
      toast.error(error.message || "Failed to update class!", {
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
      <AdminNavbar></AdminNavbar>
      <img
        src={img5}
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
        className="container box3 mt-3 "
        style={{ width: "500px", padding: "15px" }}
      >
        <h4 className="text-center text-warning">Edit Class</h4>
        <div className="underline1 bg-warning w-100"></div>
        <form className="mt-1  p-3 w-100" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="className" className="form-label text-warning">
              Class Name
            </label>
            <input
              type="text"
              className="form-control"
              id="className"
              placeholder="Enter Class Name"
              name="className"
              value={inputData.className}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="instructor" className="form-label text-warning">
              Instructor
            </label>
            <select
              className="form-select"
              id="instructor"
              name="instructor"
              value={inputData.instructor}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor, index) => (
                <option key={index} value={instructor.name}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="time" className="form-label text-warning">
              Time
            </label>
            <input
              type="time" // Change input type to "time"
              className="form-control"
              id="time"
              name="time"
              value={inputData.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label text-warning">
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              placeholder="Enter Class Location"
              name="location"
              value={inputData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label text-warning">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={inputData.date}
              onChange={handleDateChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              style={{ visibility: "hidden" }}
              value={user._id}
              readOnly
            />
          </div>

          <button className="btn btn-warning" style={{ marginRight: "240px" }}>
            Update Class
          </button>

          <button
            className="btn btn-warning"
            onClick={() => navigate("/trainer-user-view", { state: { user } })}
          >
            BACK
          </button>
        </form>
      </div>
    </div>
  );
}
