import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img5 from "../../img/back.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PaymentView() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };

  const [payments, setPayments] = useState([]);
  const [payments1, setPayments1] = useState([]);

  // Fetch payments data from the server
  const fetchPayments = async () => {
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
        throw new Error("Failed to fetch payments");
      }
      const data = await response.json();
      // Update the state to include both payment and product details
      const paymentsWithData = await Promise.all(
        data.map(async (payment) => {
          const productResponse = await fetch(
            `http://localhost:5000/api/products/${payment.product}`
          );
          if (!productResponse.ok) {
            throw new Error("Failed to fetch product");
          }
          const productData = await productResponse.json();
          return { ...payment, productData };
        })
      );
      setPayments(paymentsWithData);
    } catch (error) {
      console.error("Error fetching payments:", error.message);
      toast.error("Failed to fetch payments");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Details", 10, 10);
    const tableRows = payments1.map((payment) => [
      payment.user,
      payment._id,
      payment.name,
      payment.cardNo,
      payment.expireDate,
      payment.expiremonth,
      payment.productData ? payment.productData.name : "",
    ]);

    doc.autoTable({
      head: [
        [
          "User ID",
          "Payment ID",
          "Name",
          "Card No",
          "Expire Date",
          "Month Date",
          "Product",
        ],
      ],
      body: tableRows,
    });

    doc.save("payments.pdf");
  };
  const fetch1Payments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payments/");
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }
      const data = await response.json();

      // Extract all payments from the array
      const allPayments = data.flatMap((item) => item.payments);

      // Update the state to include both payment and product details
      const paymentsWithData = await Promise.all(
        allPayments.map(async (payment) => {
          try {
            console.log(payment.product);
            const productResponse = await fetch(
              `http://localhost:5000/api/products/${payment.product}`
            );
            if (!productResponse.ok) {
              throw new Error("Failed to fetch product");
            }
            const productData = await productResponse.json();
            return { ...payment, productData };
          } catch (error) {
            console.error("Error fetching product:", error.message);
            // Handle error, e.g., return default productData or display a placeholder
            return { ...payment, productData: null }; // Assuming productData is an object
          }
        })
      );
      setPayments1(paymentsWithData);
    } catch (error) {
      console.error("Error fetching payments:", error.message);
      toast.error("Failed to fetch payments");
    }
  };
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderBackButton = () => {
    if (user.role === "admin") {
      const filteredPayments = payments1.filter((payment) =>
        payment.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <div>
          <div className="container mt-5">
            <h4 className="text-warning text-center">All Payments</h4>
            <div className="underline bg-warning w-100"></div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-control mt-3"
              style={{ width: "25%" }}
            />
            <table className="table table-bordered mt-3">
              <thead className="bg-warning">
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Payment ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Card No</th>
                  <th scope="col">Expire Date</th>
                  <th scope="col">Month Date</th>
                  <th scope="col">Product</th>
                </tr>
              </thead>
              <tbody className="box3">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="text-warning">{payment.user}</td>
                    <td className="text-warning">{payment._id}</td>
                    <td className="text-warning">{payment.name}</td>
                    <td className="text-warning">{payment.cardNo}</td>
                    <td className="text-warning">{payment.expireDate}</td>
                    <td className="text-warning">{payment.expiremonth}</td>
                    <td className="text-warning">
                      {payment.productData && payment.productData.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-body text-center ">
            <button className="btn btn-primary me-3" onClick={generatePDF}>
              Download as PDF
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleButtonClick("/admin-home")}
            >
              BACK
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="container mt-5">
            <h4 className="text-warning text-center">My Payments</h4>

            <div className="underline bg-warning w-100"></div>
            <table className="table table-bordered mt-5">
              <thead className="bg-warning">
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Payment ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Card No</th>
                  <th scope="col">Expire Date</th>
                  <th scope="col">Month Date</th>
                  <th scope="col">Product</th>
                </tr>
              </thead>
              <tbody className="box3">
                {payments &&
                  payments.map((payment) => {
                    if (!(payment.product == null)) {
                      return (
                        <tr key={payment._id}>
                          <td className="text-warning">{payment.user}</td>
                          <td className="text-warning">{payment._id}</td>
                          <td className="text-warning">{payment.name}</td>
                          <td className="text-warning">{payment.cardNo}</td>
                          <td className="text-warning">{payment.expireDate}</td>
                          <td className="text-warning">
                            {payment.expiremonth}
                          </td>
                          {/* Display product details */}
                          <td className="text-warning">
                            {payment.productData && payment.productData.name}
                          </td>
                        </tr>
                      );
                    } else {
                      return null; // Render nothing if product is not null
                    }
                  })}
              </tbody>
            </table>
          </div>
          <div className="card-body text-center ">
            <button
              className="btn btn-warning"
              onClick={() => handleButtonClick("/home")}
            >
              BACK
            </button>
          </div>
        </div>
      );
    }
  };
  useEffect(() => {
    fetchPayments();
    fetch1Payments();
  }, []);

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

      {renderBackButton()}
      <ToastContainer />
    </div>
  );
}
