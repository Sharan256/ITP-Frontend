import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img from "../../img/back.jpg";
import supplements3 from "../../img/supplements3.png";
import supplements2 from "../../img/supplements2.png";
import supplements1 from "../../img/supplements1.png";
import supplements4 from "../../img/supplements4.png";
import supplements5 from "../../img/supplements5.jpg";
import supplements6 from "../../img/supplements6.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ProductView() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { user } = location.state || {};
  const history = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePrintButtonClick = () => {
    // Initialize jsPDF instance
    const doc = new jsPDF();

    // Add a title to the PDF document
    doc.text("Products Report", 10, 10);

    // Extract table data from the state
    const data = products.map((product) => [
      product.name,
      product.price + ".00",
      product.quantity,
    ]);

    // Define columns for the table
    const columns = ["Name", "Price", "Quantity"];

    // Add table to the PDF document
    doc.autoTable({
      head: [columns],
      body: data,
    });

    // Save the PDF document
    doc.save("products_report.pdf");
  };

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

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      toast.success("Product deleted successfully");
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error("Failed to delete product");
    }
  };

  const handleAddProduct = () => {
    history("/product", { state: { user } }); // Navigate to add product page
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          height: "850px",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div
        className="container mt-3 "
        style={{ width: "1000px", padding: "35px" }}
      >
        <h4 className="text-warning text-center">Products</h4>
        <div className="underline1 bg-warning w-100"></div>

        {/* Add search input field */}
        <div className="mt-3 w-25">
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <br></br>
        <div className="mb-3">
          <button className="btn btn-warning" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        <div className="row d-flex justify-content-center">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-sm-3">
              <div className="card mb-3 box3  border-dark ">
                <img
                  src={getImageForPackage(product.imgUrl)}
                  className="card-img mx-auto d-block"
                  alt={product.name}
                  style={{ width: "40%", height: "120px" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-center">{product.name}</h5>
                  <p className="card-text  text-center">
                    Price: RS {product.price}.00
                  </p>
                  <p className="card-text  text-center">
                    Quantity: {product.quantity} available
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        history(`/edit-product/`, {
                          state: { user, productId: product._id },
                        })
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button
            className="btn btn-warning"
            style={{ marginRight: "10px" }}
            onClick={handlePrintButtonClick}
          >
            Print
          </button>
          <button
            className="btn btn-warning"
            onClick={() => history("/admin-home", { state: { user } })}
          >
            Back
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
