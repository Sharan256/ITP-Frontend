import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img from "../../img/back.jpg";

export default function AddTrainer() {
  const location = useLocation();
  const { user, trainerId } = location.state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: trainerId?.username || "",
    qualification: "",
    role: "trainer",
    gender: trainerId?.gender || "",
    experience: "",
    contactNo: "",
    email: trainerId?.email || "",
    bio: "",
    imgUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/trainers/${trainerId._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add trainer");
      }

      toast.success("Trainer added successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/trainer-add-view", { state: { user } });
      }, 2000);
    } catch (error) {
      console.error("Error adding trainer:", error.message);
      toast.error(error.message || "Failed to add trainer!", {
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
          height: "1100px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div className="container mt-5 ">
        <h4 className="text-warning">Add Trainer</h4>
        <div className="underline1 bg-warning"></div>
        <form className="mt-5 shadow w-50 p-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-warning">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="qualification" className="form-label text-warning">
              Qualification
            </label>
            <input
              type="text"
              className="form-control"
              id="qualification"
              placeholder="Enter qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label text-warning">
              Role
            </label>
            <input
              type="text"
              className="form-control"
              id="role"
              placeholder="Enter role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label text-warning">
              Gender
            </label>
            <input
              className="form-control"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              readOnly
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="experience" className="form-label text-warning">
              Experience
            </label>
            <input
              type="text"
              className="form-control"
              id="experience"
              placeholder="Enter experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactNo" className="form-label text-warning">
              Contact Number
            </label>
            <input
              type="text"
              className="form-control"
              id="contactNo"
              placeholder="Enter contact number"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-warning">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bio" className="form-label text-warning">
              Bio
            </label>
            <input
              type="text"
              className="form-control"
              id="bio"
              placeholder="Enter bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imgUrl" className="form-label text-warning">
              Image URL
            </label>
            <input
              type="text"
              className="form-control"
              id="imgUrl"
              placeholder="Enter image URL"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="d-flex">
            <button className="btn btn-warning">Add Trainer</button>
            <ToastContainer />
            <button
              className="btn btn-warning ms-auto"
              onClick={() => navigate("/trainer-add-view", { state: { user } })}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
