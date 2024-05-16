import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img5 from "../../img/back.jpg";
import UserNavbar from "../UserNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import gold from "../../img/gold-removebg-preview.png";
import platinum from "../../img/platinum-removebg-preview.png";
import silver from "../../img/silver_PNG17190.png";
import standard from "../../img/standard.jpg";
const UserPackages = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [paidAmount, setPaidAmount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [createAt, setCreateAt] = useState(null);

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };

  const handleSelectClick = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/active-pack/${user._id}/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active: true }), // Set active to true
        }
      );

      if (!response.ok) {
        throw new Error("Failed to select pack");
      }

      toast.success("pack selected successfully");
      fetchPackages();
      fetchActivePackageStatus();
      setTimeout(() => {
        navigate("/package-user-view", { state: { user } });
      }, 2000);
    } catch (error) {
      console.error("Error selecting pack:", error.message);
      toast.error("Failed to select pack");
    }
  };
  const deletePackage = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/active-pack/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete Package");
      }
      toast.success("Package deleted successfully");
      fetchPackages();
      fetchActivePackageStatus();
      setTimeout(() => {
        navigate("/home", { state: { user } });
      }, 2000);
    } catch (error) {
      console.error("Error deleting Package:", error.message);
      toast.error("Failed to delete Package");
    }
  };
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

  const fetchActivePackageStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/active-pack/${user._id}`
      );

      if (!response.ok) {
        throw new Error("Failed to check active package status");
      }

      const activePackageData = await response.json();

      if (activePackageData.active) {
        // If active package exists, disable the select button
        setSelectedPackageId(activePackageData.packageId);
        setSelectedPackage(activePackageData);
        setCreateAt(activePackageData.createdAt);
        // Fetch paid amount and balance for the user
        const paidAmountBalanceResponse = await fetch(
          `http://localhost:5000/api/packpay/user/${user._id}`
        );

        if (!paidAmountBalanceResponse.ok) {
          throw new Error("Failed to fetch paid amount and balance");
        }

        const [{ paidAmount, balance }] =
          await paidAmountBalanceResponse.json();

        setPaidAmount(paidAmount);
        setBalance(balance);
      }
    } catch (error) {
      console.error("Error checking active package status:", error.message);
      //toast.error("Failed to check active package status");
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchActivePackageStatus();

    // Check if the selected package's validity is 0 and delete it
    if (
      selectedPackageId &&
      calculateRemainingValidity(createAt, selectedPackageId.validity) === 0
    ) {
      deletePackage(user._id);
    }
  }, [createAt, selectedPackageId]);

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

  const calculateRemainingValidity = (createdAt, validity) => {
    const currentDate = new Date();
    const packageCreatedAt = new Date(createdAt);
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const daysSinceCreation = Math.floor(
      (currentDate - packageCreatedAt) / millisecondsInDay
    );
    const remainingValidity = validity - daysSinceCreation;
    return remainingValidity > 0 ? remainingValidity : 0;
  };

  const renderBackButton = (id) => {
    if (selectedPackageId === null) {
      return (
        <div>
          <button
            className="btn btn-warning"
            onClick={() => handleSelectClick(id)}
          >
            SELECT
          </button>
        </div>
      );
    } else {
      return <div></div>;
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
          height: "1200px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <ToastContainer />
      {selectedPackageId && (
        <div>
          <h1 className="mt-5 text-center text-warning"> SELECTED PACKAGE</h1>
          <div
            className="container mt-3 "
            style={{ width: "900px", padding: "15px" }}
          >
            <div className="row d-flex justify-content-center">
              <div className="col-sm-3">
                <div className="card mb-3 box3  border-dark ">
                  <img
                    src={getImageForPackage(selectedPackageId.imgUrl)}
                    className="card-img mx-auto d-block"
                    alt={selectedPackageId.name}
                    style={{ width: "40%", height: "120px" }}
                  />
                  <div className="card-body text-center ">
                    <h5 className="card-title  text-center text-warning">
                      {selectedPackageId.name}
                    </h5>
                    <p className="card-text text-center text-warning">
                      Detail: {selectedPackageId.detail}
                    </p>
                    <p className="card-text text-center text-warning">
                      Price: RS.{selectedPackageId.price}.00
                    </p>
                    <p className="card-text text-center text-warning">
                      Validity:{" "}
                      {calculateRemainingValidity(
                        createAt,
                        selectedPackageId.validity
                      )}{" "}
                      Days
                    </p>
                    <p className="card-text text-center text-warning">
                      PaidAmount: {paidAmount || 0}.00
                    </p>
                    <p className="card-text text-center text-warning">
                      Balance: {balance || 0}.00
                    </p>
                    <button
                      className="btn btn-warning"
                      onClick={() => deletePackage(user._id)}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {renderBackButton(packageItem._id)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-body text-center ">
        <button
          className="btn btn-warning"
          onClick={() => handleButtonClick("/home")}
        >
          BACK
        </button>
      </div>
    </div>
  );
};

export default UserPackages;
