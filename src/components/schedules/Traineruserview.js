import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../../img/back.jpg";
import Navbar from "../UserNavbar";
import defaultTrainerImage from "../../img/gold-removebg-preview.png";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TrainerView = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const doc = new jsPDF();

  const [trainers, setTrainers] = useState([]);
  const [trainers1, setTrainers1] = useState([]);
  const [trainers2, setTrainers2] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);

  const fetchUserTrainers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/schedules/user/${user._id}`
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

  const downloadPDF = () => {
    doc.text("Schedule Details", 10, 10);
    const tableRows = trainers2.map((trainer) => [
      trainer._id,
      trainer.userData._id,
      trainer.className,
      trainer.instructor,
      trainer.time,
      trainer.userData.username,
      formatDate(trainer.date),
    ]);

    doc.autoTable({
      head: [
        [
          "Schedule ID",
          "User ID",
          "Class Name",
          "Instructor Name",
          "Time",
          "User Name",
          "Date",
        ],
      ],
      body: tableRows,
    });

    doc.save("Schedule_details.pdf");
  };

  const fetchScheduleTrainers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/schedules/schedules/${user.username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trainers");
      }
      const data = await response.json();

      const trainersWithUserData = await Promise.all(
        data.map(async (trainer) => {
          try {
            const userResponse = await fetch(
              `http://localhost:5000/api/auth/${trainer.userId}`
            );
            if (!userResponse.ok) {
              throw new Error("Failed to fetch user");
            }
            const userData = await userResponse.json();
            return { ...trainer, userData };
          } catch (error) {
            console.error(
              "Error fetching user data for trainer:",
              error.message
            );
            return { ...trainer, userData: null };
          }
        })
      );

      setTrainers1(trainersWithUserData);
    } catch (error) {
      console.error("Error fetching trainers:", error.message);
      toast.error("Failed to fetch trainers");
    }
  };

  const fetchAllTrainers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/schedules/`);
      if (!response.ok) {
        throw new Error("Failed to fetch trainers");
      }
      const data = await response.json();

      const trainersWithUserData = await Promise.all(
        data.map(async (trainer) => {
          try {
            const userResponse = await fetch(
              `http://localhost:5000/api/auth/${trainer.userId}`
            );
            if (!userResponse.ok) {
              throw new Error("Failed to fetch user");
            }
            const userData = await userResponse.json();
            return { ...trainer, userData };
          } catch (error) {
            console.error(
              "Error fetching user data for trainer:",
              error.message
            );
            return { ...trainer, userData: null };
          }
        })
      );

      setTrainers2(trainersWithUserData);
      setFilteredTrainers(trainersWithUserData);
    } catch (error) {
      console.error("Error fetching trainers:", error.message);
      toast.error("Failed to fetch trainers");
    }
  };

  useEffect(() => {
    fetchUserTrainers();
    fetchScheduleTrainers();
    fetchAllTrainers();
  }, []);

  const renderBackButton = () => {
    if (user.role === "trainer") {
      return (
        <div>
          <div
            className="container mt-3 "
            style={{ width: "900px", padding: "15px" }}
          >
            <div className="row d-flex justify-content-center">
              {trainers1.map((trainer) => (
                <div key={trainer._id} className="col-sm-3">
                  <div className="card mb-3 box3 border-dark">
                    <img
                      src={trainer.imgUrl || defaultTrainerImage}
                      className="card-img mx-auto d-block"
                      alt={trainer.instructor}
                      style={{ width: "50%", height: "150px" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title text-center text-warning">
                        {trainer.username}
                      </h5>
                      <p className="card-text text-center text-warning">
                        Class Name: {trainer.className}
                      </p>
                      <p className="card-text text-center text-warning">
                        User Name: {trainer.userData.username}
                      </p>
                      <p className="card-text text-center text-warning">
                        Time: {trainer.time}
                      </p>
                      <p className="card-text text-center text-warning">
                        Location: {trainer.location}
                      </p>
                      <p className="card-text text-center text-warning">
                        Date: {formatDate(trainer.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (user.role === "admin") {
      return (
        <div>
          <center>
            <div className="input-group mb-3 mt-3 w-25">
              <input
                type="text"
                className="form-control"
                placeholder="Search by trainer name"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filtered = trainers2.filter((trainer) =>
                    trainer.instructor.toLowerCase().includes(searchTerm)
                  );
                  setFilteredTrainers(filtered);
                }}
              />
            </div>
          </center>
          <div
            className="container mt-3 "
            style={{ width: "900px", padding: "15px" }}
          >
            <div className="row d-flex justify-content-center">
              {filteredTrainers.map((trainer) => (
                <div key={trainer._id} className="col-sm-3">
                  <div className="card mb-3 box3 border-dark">
                    <img
                      src={trainer.imgUrl || defaultTrainerImage}
                      className="card-img mx-auto d-block"
                      alt={trainer.instructor}
                      style={{ width: "50%", height: "150px" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title text-center text-warning">
                        {trainer.username}
                      </h5>
                      <p className="card-text text-center text-warning">
                        Class Name: {trainer.className}
                      </p>
                      <p className="card-text text-center text-warning">
                        Trainer Name: {trainer.instructor}
                      </p>
                      <p className="card-text text-center text-warning">
                        User Name: {trainer.userData.username}
                      </p>
                      <p className="card-text text-center text-warning">
                        Time: {trainer.time}
                      </p>
                      <p className="card-text text-center text-warning">
                        Location: {trainer.location}
                      </p>
                      <button
                        className="btn btn-danger ms-2"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() => deleteClass(trainer._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div class="d-grid gap-2 col-2 mx-auto">
              <button className="btn btn-primary" onClick={downloadPDF}>
                Download
              </button>
              <button
                className="btn btn-warning ms-2"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={() => navigate("/admin-home", { state: { user } })}
              >
                BACK
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div
            className="container mt-3 "
            style={{ width: "900px", padding: "15px" }}
          >
            <div className="row d-flex justify-content-center">
              {trainers.map((trainer) => (
                <div key={trainer._id} className="col-sm-3">
                  <div className="card mb-3 box3 border-dark">
                    <img
                      src={trainer.imgUrl || defaultTrainerImage}
                      className="card-img mx-auto d-block"
                      alt={trainer.instructor}
                      style={{ width: "50%", height: "150px" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title text-center text-warning">
                        {trainer.username}
                      </h5>
                      <p className="card-text text-center text-warning">
                        Class Name: {trainer.className}
                      </p>
                      <p className="card-text text-center text-warning">
                        Instructor: {trainer.instructor}
                      </p>
                      <p className="card-text text-center text-warning">
                        Time: {trainer.time}
                      </p>
                      <p className="card-text text-center text-warning">
                        Location: {trainer.location}
                      </p>
                      <p className="card-text text-center text-warning">
                        Date: {formatDate(trainer.date)}
                      </p>
                      <button
                        className="btn btn-warning ms-2"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() =>
                          navigate("/edit", { state: { user, trainer } })
                        }
                      >
                        UPDATE
                      </button>
                      <br />
                      <br />
                      <button
                        className="btn btn-danger ms-2"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() => deleteClass(trainer._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-body text-center">
            <button
              className="btn btn-warning"
              style={{ marginRight: "262px" }}
              onClick={() => navigate("/add-classes", { state: { user } })}
            >
              ADD SCHEDULE
            </button>
            <button
              className="btn btn-warning"
              onClick={() => navigate("/home", { state: { user } })}
            >
              BACK
            </button>
          </div>
        </div>
      );
    }
  };

  const deleteClass = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/schedules/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete class");
      }
      fetchUserTrainers();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
          height: "850px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <h1 className="mt-5 text-center text-warning">SCHEDULES</h1>
      {renderBackButton()}
      <ToastContainer />
    </div>
  );
};

export default TrainerView;
