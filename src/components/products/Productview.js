import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img5 from "../../img/back.jpg";
import UserNavbar from "../UserNavbar";
import supplements3 from "../../img/supplements3.png";
import supplements2 from "../../img/supplements2.png";
import supplements1 from "../../img/supplements1.png";
import supplements4 from "../../img/supplements4.png";
import supplements5 from "../../img/supplements5.jpg";
import supplements6 from "../../img/supplements6.jpg";
import { useLocation, useNavigate } from "react-router-dom";

const UserProducts = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const handleButtonClick = (path, product) => {
    navigate(path, { state: { user, product } });
  };

  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState(""); // State for search text

  // Fetch products data from the server
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products/");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      toast.error("Failed to fetch products");
    }
  };

  // Map package name or index to corresponding image
  const getImageForPackage = (packageImgUrl) => {
    switch (packageImgUrl.toLowerCase()) {
      case "muscle mass":
        return supplements1;
      case "mass gainer":
        return supplements2;
      case "vegan protein":
        return supplements3;
      case "enhance":
        return supplements4;
      case "whey":
        return supplements5;
      case "isolate":
        return supplements6;
      default:
        return null; // Default image or handle edge cases
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search text
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
      <h1 className="mt-5 text-center text-warning">PRODUCTS</h1>
      {/* Search input */}
      <div className="container mt-3 mb-3 text-center">
        <input
          type="text"
          placeholder="Search by Product Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control w-25"
          style={{ width: "50%", margin: "auto" }}
        />
      </div>
      <div
        className="container mt-3 "
        style={{ width: "900px", padding: "15px" }}
      >
        <div className="row d-flex justify-content-center">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-sm-3">
              <div className="card mb-3 box3  border-dark ">
                <img
                  src={getImageForPackage(product.imgUrl)}
                  className="card-img mx-auto d-block"
                  alt={product.name}
                  style={{ width: "50%", height: "150px" }}
                />
                <div className="card-body text-center ">
                  <h5 className="card-title  text-center text-warning">
                    {product.name}
                  </h5>
                  <p className="card-text text-center text-warning">
                    Price: RS.{product.price}.00
                  </p>
                  <p className="card-text text-center text-warning">
                    Quantity: {product.quantity}
                  </p>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleButtonClick("/payment", product)}
                  >
                    Buy
                  </button>
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
      <ToastContainer />
    </div>
  );
};

export default UserProducts;
