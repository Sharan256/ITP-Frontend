import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import img from "../../img/back.jpg";

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user  } = location.state || {};
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    imgUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      toast.success("Product added successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/product-admin-view",{state:{user}});
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error.message);
      toast.error(error.message || "Failed to add product!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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
          height: "1100px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div
        className="container box3 mt-3 "
        style={{ width: "500px", padding: "35px" }}
      >
        <h4 className="text-warning text-center">Add Product</h4>
        <div className="underline1 bg-warning w-100"></div>
        <form className="mt-5  w-100 p-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-warning">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
  <label htmlFor="price" className="form-label text-warning">
    Price
  </label>
  <input
    type="number"
    className="form-control"
    id="price"
    placeholder="Enter price"
    name="price"
    value={formData.price}
    onChange={handleInputChange}
    min="0" // Set minimum value to 0
    required
  />
</div>
<div className="mb-3">
  <label htmlFor="quantity" className="form-label text-warning">
    Quantity
  </label>
  <input
    type="number"
    className="form-control"
    id="quantity"
    placeholder="Enter quantity"
    name="quantity"
    value={formData.quantity}
    onChange={handleInputChange}
    min="0" // Set minimum value to 0
    required
  />
</div>
  <div className="mb-3">
            <label htmlFor="imgUrl" className="form-label text-warning">
              Image URL
            </label>
            <input
              type="text"
              className="form-control"
              id="imgUrl"
              placeholder="Enter image URL"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="d-flex">
            <button className="btn btn-warning">Add Product</button>
            <ToastContainer />
            <button
              className="btn btn-warning ms-auto"
              onClick={() => navigate("/product-admin-view",{state:{user}})}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
