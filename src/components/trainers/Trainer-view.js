import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img5 from "../../img/back.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Traineraddview() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [trainerDetailsExist, setTrainerDetailsExist] = useState({});
  const [searchText, setSearchText] = useState(""); // State for search text
  const doc = new jsPDF();

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Fetch trainer details from the server
  const fetchTrainers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/trainer`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trainers");
      }
      const data = await response.json();
      setTrainers(data);
      fetchAllTrainerDetails(data);
    } catch (error) {
      console.error("Error fetching trainers:", error.message);
      toast.error("Failed to fetch trainers");
    }
  };

  // Fetch trainer details by ID
  const fetchTrainerDetails = async (trainerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trainers/user/${trainerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trainer details");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching trainer details:", error.message);
      return null;
    }
  };

  // Fetch details for all trainers
  const fetchAllTrainerDetails = async (trainers) => {
    const detailsPromises = trainers.map((trainer) =>
      fetchTrainerDetails(trainer._id)
    );
    const details = await Promise.all(detailsPromises);

    const detailsExist = {};
    trainers.forEach((trainer, index) => {
      detailsExist[trainer._id] = !!details[index];
    });
    setTrainerDetailsExist(detailsExist);
  };

  const handleButtonClick = (path, trainerId) => {
    navigate(path, { state: { user, trainerId } });
  };

  // Render the add trainer details button based on whether details exist
  const renderBackButton = (trainer) => {
    if (!trainerDetailsExist[trainer._id]) {
      return (
        <div>
          <button
            className="btn btn-danger me-2"
            onClick={() => deleteTrainer(trainer._id)}
          >
            Delete
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => handleButtonClick("/edit-trainer", trainer)}
          >
            Edit
          </button>
          <button
            className="btn btn-warning"
            onClick={() => handleButtonClick("/trainer", trainer)}
          >
            Add Trainer Details
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => handleButtonClick("/trainer-view", trainer._id)}
          >
            View Trainer Details
          </button>
        </div>
      );
    }
  };

  // Delete trainer by ID
  const deleteTrainer = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete trainer");
      }
      // Remove the deleted trainer from the list
      setTrainers(trainers.filter((trainer) => trainer._id !== id));
      toast.success("Trainer deleted successfully");
    } catch (error) {
      console.error("Error deleting trainer:", error.message);
      toast.error("Failed to delete trainer");
    }
  };

  // Generate PDF report of trainers
  const downloadPDF = () => {
    doc.text("Trainer Details", 10, 10);
    doc.autoTable({ html: "#trainer-table" });
    doc.save("trainer_details.pdf");
  };

  // Filter trainers based on search text
  const filteredTrainers = trainers.filter((trainer) =>
    trainer.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Navbar />
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
      <div className="container mt-5">
        <h4 className="text-warning text-center">Trainer Details</h4>
        <div className="underline bg-warning w-100"></div>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by Username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control w-25 mt-3 mb-3"
        />
        <table className="table table-bordered mt-3" id="trainer-table">
          <thead className="bg-warning">
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Gender</th>
              <th scope="col">Weight</th>
              <th scope="col">Height</th>
              {user.role === "admin" && <th scope="col">Actions</th>}
            </tr>
          </thead>
          <tbody className="box3">
            {filteredTrainers.map((trainer) => (
              <tr key={trainer._id}>
                <td className="text-warning">{trainer.username}</td>
                <td className="text-warning">{trainer.email}</td>
                <td className="text-warning">{trainer.gender}</td>
                <td className="text-warning">{trainer.weight}</td>
                <td className="text-warning">{trainer.height}</td>
                {user.role === "admin" && <td>{renderBackButton(trainer)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-body text-center ">
        {user.role === "admin" && (
          <button
            className="btn btn-warning"
            onClick={() => navigate("/trainer-register", { state: { user } })}
            style={{ marginRight: "262px" }}
          >
            ADD TRAINER
          </button>
        )}
        {user.role === "admin" && (
          <button
            className="btn btn-warning me-4"
            onClick={() => navigate("/admin-home", { state: { user } })}
          >
            BACK
          </button>
        )}
        {user.role === "user" && (
          <button
            className="btn btn-warning ms-auto"
            onClick={() => navigate("/home", { state: { user } })}
          >
            BACK
          </button>
        )}
        <button className="btn btn-primary" onClick={downloadPDF}>
          Download Trainer Details PDF
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
