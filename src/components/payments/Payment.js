import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img5 from "../../img/back.jpg";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, product } = location.state || {};

  const initialPaymentData = {
    id: "",
    name: "",
    cardNo: "",
    cvv: "",
    expireDate: "",
    expiremonth: "",
  };

  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const [cardNames, setCardNames] = useState([]);

  useEffect(() => {
    // Fetch card names using API
    const fetchCardNames = async () => {
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
          throw new Error("Failed to fetch card names");
        }

        const data = await response.json();
        setCardNames(data);
      } catch (error) {
        console.error("Error fetching card names:", error.message);
        toast.error(error.message || "Failed to fetch card names");
      }
    };

    fetchCardNames();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });

    // If the changed input is the card name dropdown
    if (name === "name") {
      // Find the selected card object from the card names array
      const selectedCard = cardNames.find((card) => card.name === value);

      // If a card is selected, update other fields with its details
      if (selectedCard) {
        setPaymentData({
          ...paymentData,
          id: selectedCard._id,
          name: selectedCard.name,
          cardNo: selectedCard.cardNo,
          cvv: selectedCard.cvv,
          expireDate: selectedCard.expireDate,
          expiremonth: selectedCard.expiremonth,
        });
      } else {
        // If no card is selected, reset other fields
        setPaymentData({
          ...paymentData,
          cardNo: "",
          cvv: "",
          expireDate: "",
          expiremonth: "",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.name) {
      toast.error("Name on Card is required");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/${paymentData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user, product, ...paymentData }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit payment");
      }

      toast.success("Payment submitted successfully!");
      navigate("/product-view", { state: { user } });
    } catch (error) {
      console.error("Error submitting payment:", error.message);
      toast.error(error.message || "Failed to submit payment");
    }
  };

  return (
    <div>
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
        <h1 className="text-center text-warning">Payment Form</h1>
        <div className="underline bg-warning w-100"></div>
        <br></br>
        <div className="mb-3">
          <label htmlFor="name" className="form-label text-warning">
            Store Card Name
          </label>
          <select
            className="form-select"
            id="name"
            name="name"
            value={paymentData.name}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Card Name</option>
            {cardNames.map((card, index) => (
              <option key={index} value={card.name}>
                {card.name}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="cardNo" className="form-label text-warning">
              Card Number
            </label>
            <input
              type="text"
              className="form-control"
              id="cardNo"
              name="cardNo"
              value={paymentData.cardNo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cvv" className="form-label text-warning">
              CVV
            </label>
            <input
              type="text"
              className="form-control"
              id="cvv"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expireDate" className="form-label text-warning">
              Expiration Date
            </label>
            <input
              type="text"
              className="form-control"
              id="expireDate"
              name="expireDate"
              value={paymentData.expireDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expiremonth" className="form-label text-warning">
              Expiration Month
            </label>
            <input
              type="text"
              className="form-control"
              id="expiremonth"
              name="expiremonth"
              value={paymentData.expiremonth}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-warning"
            style={{ marginRight: "230px" }}
          >
            Submit Payment
          </button>
          <button
            className="btn btn-warning "
            onClick={() => navigate("/product-view", { state: { user } })}
          >
            Back
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default PaymentForm;
