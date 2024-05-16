import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNavbar from "../UserNavbar"; // Import UserNavbar component
import img5 from "../../img/back.jpg";
const ViewPaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/payments/user/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }

        const data = await response.json();
        setPaymentData(data);
      } catch (error) {
        console.error("Error fetching payment details:", error.message);
        toast.error(error.message || "Failed to fetch payment details");
      }
    };

    fetchPaymentDetails();
  }, [user]);

  const handleEdit = async (id) => {
    navigate("/payment-edit", { state: { user, id: id, paymentData } });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete payment details");
      }

      toast.success("Payment details deleted successfully!");
      navigate("/payment-card-view", { state: { user } });
    } catch (error) {
      console.error("Error deleting payment details:", error.message);
    }
  };

  const handleCreate = () => {
    navigate("/payment-card", { state: { user } });
  };

  return (
    <div>
      <UserNavbar /> {/* Render the UserNavbar component */}
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
      <h1 className="mt-5 text-center text-warning">Card Details</h1>
      <div
        className="container mt-3 "
        style={{ width: "900px", padding: "15px" }}
      >
        <div className="row d-flex justify-content-center">
          {paymentData &&
            paymentData.map((payment) => {
              if (payment.product === null || !(payment.product === null)) {
                return (
                  <div key={payment._id} className="col-sm-3">
                    <div className="card mb-3 box3 border-dark">
                      <div className="card-body">
                        <h5 className="card-title text-center text-warning">
                          Name on Card: {payment.name}
                        </h5>
                        <p className="card-text text-center text-warning">
                          Card Number: {payment.cardNo}
                        </p>
                        <p className="card-text text-center text-warning">
                          CVV: {payment.cvv}
                        </p>
                        <p className="card-text text-center text-warning">
                          Expiration Date: {payment.expireDate}
                        </p>
                        <p className="card-text text-center text-warning">
                          Expiration Month: {payment.expiremonth}
                        </p>
                        <button
                          onClick={() => handleEdit(payment)}
                          className="btn btn-warning ms-2"
                          data-toggle="modal"
                          data-target="#exampleModal"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(payment._id)}
                          className="btn btn-danger ms-2"
                          data-toggle="modal"
                          data-target="#exampleModal"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </div>
      <div className="card-body text-center">
        <button
          onClick={handleCreate}
          style={{ marginRight: "1030px" }}
          className="btn btn-warning mt-3 mr-2"
        >
          Create Payment
        </button>
        <button
          onClick={() => {
            navigate("/home", { state: { user } });
          }}
          className="btn btn-warning mt-3"
        >
          Back
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewPaymentDetails;
