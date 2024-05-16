import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img from "../../img/back.jpg";

export default function EditTrainer() {
  const { id } = useParams();
  const location = useLocation();
  const { user, trainerId } = location.state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    role: "",
    gender: "",
    experience: "",
    contactNo: "",
    email: "",
    bio: "",
    imgUrl: "",
  });

  useEffect(() => {
    fetchTrainer();
  }, []);

  const fetchTrainer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/trainers/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trainer");
      }
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching trainer:", error.message);
      toast.error("Failed to fetch trainer");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/trainers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update trainer");
      }

      toast.success("Trainer updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/trainer-view", { state: { user, trainerId } });
      }, 2000);
    } catch (error) {
      console.error("Error updating trainer:", error.message);
      toast.error(error.message || "Failed to update trainer!", {
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
        <h4 className="text-warning">Edit Trainer</h4>
        <div className="underline1 bg-warning"></div>
        <form className="mt-5 shadow w-50 p-3" onSubmit={handleSubmit}>
          {/* Input fields for trainer details */}
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
              required
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
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label text-warning">
              Gender
            </label>
            <select
              className="form-select"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
              required
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
            <button className="btn btn-warning">Update Trainer</button>
            <ToastContainer />
            <button
              className="btn btn-warning ms-auto"
              onClick={() =>
                navigate("/trainer-view", { state: { user, trainerId } })
              }
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
