import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img5 from "../../img/back.jpg";

export default function PackageRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    detail: "",
    price: "",
    validity: "",
    imgUrl: "", // Add imgUrl field
  });

  useEffect(() => {
    // Fetch package data to pre-fill the form
    const fetchPackage = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/packages/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch package data");
        }
        const packageData = await response.json();
        setFormData({
          name: packageData.name,
          detail: packageData.detail,
          price: packageData.price,
          validity: packageData.validity,
          imgUrl: packageData.imgUrl,
        });
      } catch (error) {
        console.error("Error fetching package data:", error.message);
        toast.error("Failed to fetch package data");
      }
    };

    fetchPackage();
  }, []);

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, detail, price, validity, imgUrl } = formData;

    try {
      const response = await fetch(`http://localhost:5000/api/packages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          detail: detail,
          price: price,
          validity: validity,
          imgUrl: imgUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update package");
      }

      toast.success("Package updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/package-view", { state: { user } });
      }, 3000);
    } catch (error) {
      console.error("Error updating package:", error.message);
      toast.error("Failed to update package", {
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
        <h4 className="text-warning">Update Package</h4>
        <div className="underline1 bg-warning"></div>
        <form className="mt-5 shadow p-5 w-75" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="packageName" className="form-label text-warning">
              Package Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter package name"
              name="name"
              value={formData.name}
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
              id="detail"
              placeholder="Enter package detail"
              name="detail"
              value={formData.detail}
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
              id="price"
              placeholder="Enter package price"
              name="price"
              value={formData.price}
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
              id="validity"
              placeholder="Enter package validity"
              name="validity"
              value={formData.validity}
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
            <button className="btn btn-warning">Update Package</button>
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
