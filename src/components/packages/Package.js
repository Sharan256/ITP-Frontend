import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img5 from "../../img/back.jpg";
export default function PackageRegistration() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    packageName: "",
    packageDetail: "",
    packagePrice: "",
    packageValidity: "",
    imgUrl: "", // Add imgUrl field
  });
  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      packageName,
      packageDetail,
      packagePrice,
      packageValidity,
      imgUrl,
    } = formData; // Include imgUrl in the submission data

    try {
      const response = await fetch("http://localhost:5000/api/packages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: packageName,
          detail: packageDetail,
          price: packagePrice,
          validity: packageValidity,
          imgUrl: imgUrl,
        }), // Include imgUrl in the request body
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create package");
      }

      toast.success("Package created successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/package-view", { state: { user } }); // Redirect to home or package list page
      }, 3000);
    } catch (error) {
      console.error("Error creating package:", error.message);
      toast.error(error.message || "Failed to create package!", {
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
        <h4 className="text-warning">Create Package</h4>
        <div className="underline1 bg-warning"></div>
        <form className="mt-5 shadow p-5 w-75" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="packageName" className="form-label text-warning">
              Package Name
            </label>
            <input
              type="text"
              className="form-control"
              id="packageName"
              placeholder="Enter package name"
              name="packageName"
              value={formData.packageName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="packageDetail" className="form-label text-warning">
              Package Detail
            </label>
            <textarea
              className="form-control"
              id="packageDetail"
              placeholder="Enter package detail"
              name="packageDetail"
              value={formData.packageDetail}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="packagePrice" className="form-label text-warning">
              Package Price
            </label>
            <input
              type="number"
              className="form-control"
              id="packagePrice"
              placeholder="Enter package price"
              name="packagePrice"
              value={formData.packagePrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="packageValidity"
              className="form-label text-warning"
            >
              Package Validity (in days)
            </label>
            <input
              type="number"
              className="form-control"
              id="packageValidity"
              placeholder="Enter package validity"
              name="packageValidity"
              value={formData.packageValidity}
              onChange={handleInputChange}
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
          <div className="card-body text-center">
            <button className="btn btn-warning">Create Package</button>
            <ToastContainer />
            <div className="card-body text-center ">
              <button
                className="btn btn-warning"
                onClick={() => handleButtonClick("/package-view")}
              >
                BACK
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
