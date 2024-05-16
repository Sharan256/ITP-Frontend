import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../UserNavbar";
import img5 from "../../img/back.jpg";
export default function ViewClass() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const [bmi, setBMI] = useState(null);

  const calculateBMI = () => {
    const heightInMeters = user.height / 100; // Convert height to meters
    const bmiValue = user.weight / (heightInMeters * heightInMeters); // Calculate BMI
    setBMI(bmiValue.toFixed(2)); // Set BMI value to state with 2 decimal places
  };

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
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
        <h4 className="text-warning text-center">BMI TRACKER</h4>
        <div className="underline bg-warning  w-100"></div>
        <ul className="list-group w-70 mt-4">
          <li
            className="list-group-item  bg-warning  text-dark"
            aria-current="true"
          >
            BMI TRACKER - {user.username}
          </li>
          <li className="list-group-item box2 text-warning">
            Your weight is: {user.weight} Kg
          </li>
          <li className="list-group-item box2 text-warning">
            Your height is: {user.height} cm
          </li>
          {bmi && (
            <li className="list-group-item box2 text-warning">
              Your BMI is: {bmi}
            </li>
          )}{" "}
          {/* Show BMI if calculated */}
        </ul>

        <div className="mt-3">
          <button
            className="btn btn-warning mr-5"
            style={{ marginRight: "182px" }}
            onClick={calculateBMI}
          >
            Find My BMI
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            className="btn btn-warning "
            onClick={() => handleButtonClick("/home")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
