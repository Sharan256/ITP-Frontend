import React from "react";
import img from "../img/profile.png";
import img1 from "../img/calculate.png";
import img2 from "../img/team.png";
import img3 from "../img/payment.png";
import img4 from "../img/pack.png";
import img5 from "../img/back.jpg";
import img6 from "../img/buy.png";
import img7 from "../img/schedule.png";
import UserNavbar from "./UserNavbar";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";

const UserHome = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };

  const catalogs = [
    { id: 1, name: "PROFILE", imgUrl: img, path: "/profile" },
    { id: 2, name: "BMI TRACKER", imgUrl: img1, path: "/bmi-tracker" },
    { id: 3, name: "SCHEDULE", imgUrl: img7, path: "/trainer-user-view" },
    { id: 4, name: "PAYMENT", imgUrl: img3, path: "/payment-view" },
    { id: 5, name: "PACKAGES", imgUrl: img4, path: "/package-user-view" },
    { id: 6, name: "PRODUCTS", imgUrl: img6, path: "/product-view" },
    { id: 7, name: "CARD DETAILS", imgUrl: img3, path: "/payment-card-view" },
  ];

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
          height: "1100px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <h1 className="mt-5 text-center text-warning">
        Welcome, {user.username}!
      </h1>
      <div
        className="container  mt-3 "
        style={{ width: "900px", padding: "35px" }}
      >
        <div className="row ">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="col-sm-4 ">
              <div className="card mb-3 box3">
                <img
                  src={catalog.imgUrl}
                  className="card-img mx-auto d-block"
                  alt={catalog.name}
                  style={{ width: "50%", height: "150px" }}
                />

                <div className="card-body text-center ">
                  <h5 className="card-title text-center text-warning">
                    {catalog.name}
                  </h5>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleButtonClick(catalog.path)}
                  >
                    GO
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
