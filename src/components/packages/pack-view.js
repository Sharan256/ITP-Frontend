import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img5 from "../../img/back.jpg";
import UserNavbar from "../Navbar";
import gold from "../../img/gold-removebg-preview.png";
import platinum from "../../img/platinum-removebg-preview.png";
import silver from "../../img/silver_PNG17190.png";
import standard from "../../img/standard.jpg";

const UserPackages = ({ user }) => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const [packages, setPackages] = useState([]);

  // Fetch packages data from the server
  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/packages/");
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error.message);
      toast.error("Failed to fetch packages");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Map package name or index to corresponding image
  const getImageForPackage = (packageImgUrl) => {
    switch (packageImgUrl.toLowerCase()) {
      case "gold":
        return gold;
      case "platinum":
        return platinum;
      case "silver":
        return silver;
      case "standard":
        return standard;
      default:
        return null; // Default image or handle edge cases
    }
  };

  return (
    <div>
      <UserNavbar />
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
      <h1 className="mt-5 text-center text-warning">PACKAGES</h1>
      <div
        className="container mt-3 "
        style={{ width: "900px", padding: "15px" }}
      >
        <div className="row d-flex justify-content-center">
          {packages.map((packageItem) => (
            <div key={packageItem._id} className="col-sm-3">
              <div className="card mb-3 box3  border-dark ">
                <img
                  src={getImageForPackage(packageItem.imgUrl)}
                  className="card-img mx-auto d-block"
                  alt={packageItem.name}
                  style={{ width: "40%", height: "120px" }}
                />
                <div className="card-body text-center ">
                  <h5 className="card-title  text-center text-warning">
                    {packageItem.name}
                  </h5>
                  <p className="card-text text-center text-warning">
                    Detail: {packageItem.detail}
                  </p>
                  <p className="card-text text-center text-warning">
                    Price: RS.{packageItem.price}.00
                  </p>
                  <p className="card-text text-center text-warning">
                    Validity: {packageItem.validity}Days
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-body text-center ">
        <button
          className="btn btn-warning"
          onClick={() => handleButtonClick("/")}
        >
          BACK
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserPackages;
