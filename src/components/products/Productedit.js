import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img from "../../img/back.jpg";

export default function EditProduct() {
  const { id } = useParams();
  const location = useLocation();
  const { user, productId } = location.state || {};
  console.log(productId);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imgUrl: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      console.log(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching product:", error.message);
      toast.error("Failed to fetch product");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/product-admin-view", { state: { user } });
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error.message);
      toast.error(error.message || "Failed to update product!", {
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
        <h4 className="text-warning text-center">Edit Product</h4>
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
              type="text"
              className="form-control"
              id="price"
              placeholder="Enter price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label text-warning">
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
            <button className="btn btn-warning">Update Product</button>
            <ToastContainer />
            <button
              className="btn btn-warning ms-auto"
              onClick={() =>
                navigate("/product-admin-view", { state: { user } })
              }
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
