import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img from "../../img/back.jpg";

export default function TrainerView() {
  const location = useLocation();
  const { user, trainerId } = location.state || {};
  const [trainers, setTrainers] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trainers/user/${trainerId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trainers");
      }
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error("Error fetching trainers:", error.message);
      toast.error("Failed to fetch trainers");
    }
  };

  const deleteTrainer = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trainers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete trainer");
      }
      toast.success("Trainer deleted successfully");
      setTimeout(() => {
        history("/trainer-add-view", { state: { user } });
      }, 3000);
    } catch (error) {
      console.error("Error deleting trainer:", error.message);
      toast.error("Failed to delete trainer");
    }
  };

  const handleBack = () => {
    history("/trainer-add-view", { state: { user } });
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
        <h4 className="text-warning">Trainers</h4>
        <div className="underline1 bg-warning"></div>
        <br></br>
        <div className="mb-3">
          <button className="btn btn-primary mr-2" onClick={handleBack}>
            Back
          </button>{" "}
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
        </div>
        <div className="row mt-5">
          {trainers.map((trainer) => (
            <div key={trainer._id} className="col-sm-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{trainer.name}</h5>
                  <p className="card-text">
                    Qualification: {trainer.qualification}
                  </p>
                  <p className="card-text">Role: {trainer.role}</p>
                  <p className="card-text">Gender: {trainer.gender}</p>
                  <p className="card-text">
                    Experience: {trainer.experience} years
                  </p>
                  <p className="card-text">Contact No: {trainer.contactNo}</p>
                  <p className="card-text">Email: {trainer.email}</p>
                  <p className="card-text">Bio: {trainer.bio}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTrainer(trainer._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        history(`/edit-trainer/${trainer._id}`, {
                          state: { user, trainerId },
                        })
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
