import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../UserNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img5 from "../../img/back.jpg";
export default function EditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, username, userId, packageId, balance, initialPaidAmount } =
    location.state || {};

  const [newpaidAmount, setNewPaidAmount] = useState();

  const handleUpdatePayment = async () => {
    try {
      // Calculate the updated balance
      const updateBalance = balance - newpaidAmount;

      // Update the paid amount by adding the initial paid amount
      const updatedPaidAmount = newpaidAmount + initialPaidAmount;

      const response = await fetch(
        `http://localhost:5000/api/packpay/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paidAmount: updatedPaidAmount,
            balance: updateBalance,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update payment");
      }
      // Handle successful update
      console.log("Payment updated successfully");
      // Navigate to product-payment-view
      navigate("/product-payment-view", { state: { user } });
    } catch (error) {
      console.error("Error updating payment:", error.message);
    }
  };

  const handlePaidAmountChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= balance) {
      setNewPaidAmount(value);
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
        <h4 className="text-warning text-center">Edit Payment</h4>
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
                value={userId}
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
              <label htmlFor="balance" className="form-label text-warning">
                Balance
              </label>
              <input
                type="text"
                className="form-control"
                id="balance"
                value={balance}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="newpaidAmount"
                className="form-label text-warning text-warning"
              >
                Paid Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="newpaidAmount"
                value={newpaidAmount}
                onChange={handlePaidAmountChange}
              />
            </div>
            <button onClick={handleUpdatePayment} className="btn btn-primary">
              Update Payment
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
