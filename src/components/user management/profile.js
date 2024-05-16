import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import img5 from "../../img/back.jpg";
import UserNavbar from "../UserNavbar";

export default function ViewClass() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };

  const handleEditButtonClick = () => {
    navigate("/edit-profile", { state: { user } });
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
      <div
        className="container box3 mt-3 "
        style={{ width: "500px", padding: "35px" }}
      >
        <h4 className="text-warning text-center">PROFILE</h4>
        <div className="underline bg-warning w-100"></div>
        <ul className="list-group w-70 mt-4">
          <li
            className="list-group-item bg-warning text-dark"
            aria-current="true"
          >
            PROFILE - {user.username}
          </li>
          <li className="list-group-item box2 text-warning">
            username: {user.username}{" "}
          </li>
          <li className="list-group-item box2 text-warning">
            role: {user.role}
          </li>
          <li className="list-group-item box2 text-warning">
            email: {user.email}{" "}
          </li>
          <li className="list-group-item box2 text-warning">
            gender: {user.gender}{" "}
          </li>
          <li className="list-group-item box2 text-warning">
            weight: {user.weight} Kg
          </li>
          <li className="list-group-item box2 text-warning">
            height: {user.height} cm
          </li>
        </ul>

        <div className="mt-3">
          <button
            className="btn btn-warning mr-2"
            style={{ marginRight: "242px" }}
            onClick={() => handleEditButtonClick()}
          >
            Edit
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            className="btn btn-warning"
            onClick={() => handleButtonClick("/home")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
