import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img5 from "../../img/back.jpg";
export default function AddPage() {
  const location = useLocation();
  const { user, username, packageId, packagePrice } = location.state || {};
  const navigate = useNavigate();

  const [paidAmount, setPaidAmount] = useState("");

  const handleCreate = async () => {
    try {
      // Calculate balance
      const newBalance = packagePrice - paidAmount;

      // Create the payment record object
      const paymentRecord = {
        userId: username,
        packageId,
        paidAmount,
        balance: newBalance,
      };

      // Send POST request to the server
      const response = await fetch("http://localhost:5000/api/packpay/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRecord),
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error("Failed to create payment record");
      }

      // Navigate back to product-payment-view with user state
      navigate("/product-payment-view", { state: { user } });
    } catch (error) {
      console.error("Error creating payment record:", error.message);
      // Handle error, e.g., show a toast message
      toast.error("Failed to create payment record");
    }
  };

  const handlePaidAmountChange = (e) => {
    const value = parseFloat(e.target.value);

    // Check if the value is a valid number and within the allowed range
    if (!isNaN(value) && value >= 0 && value <= packagePrice) {
      setPaidAmount(value);
    }
  };

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
        <h4 className="text-warning text-center">Add Payment</h4>
        <div className="underline bg-warning w-100"></div>
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3">
            <div className="mb-3">
              <label htmlFor="username" className="form-label text-warning">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="packageId" className="form-label text-warning">
                Package ID
              </label>
              <input
                type="text"
                className="form-control"
                id="packageId"
                value={packageId}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="packagePrice" className="form-label text-warning">
                Package Price
              </label>
              <input
                type="text"
                className="form-control"
                id="packagePrice"
                value={packagePrice}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="paidAmount" className="form-label text-warning">
                Paid Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="paidAmount"
                value={paidAmount}
                onChange={handlePaidAmountChange}
              />
            </div>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
