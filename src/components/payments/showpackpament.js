import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const handleEditButtonClick = (
    userId,
    packageId,
    balance,
    initialPaidAmount
  ) => {
    navigate("/edit-page", {
      state: { user, userId, packageId, balance, initialPaidAmount },
    });
  };
  const handleAddButtonClick = (username, packageId, packagePrice) => {
    navigate("/add-page", {
      state: { user, username, packageId, packagePrice },
    });
  };

  const [activePackages, setActivePackages] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");

  // Function to fetch paid amount and balance
  const fetchPaidAmountAndBalance = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/packpay/user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch paid amount and balance");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Extract paidAmount and balance from the first object in the array
        const { paidAmount, balance } = data[0];
        return { paidAmount, balance };
      } else {
        // Return default values if no data is available
        return { paidAmount: 0, balance: 0 };
      }
    } catch (error) {
      console.error("Error fetching paid amount and balance:", error.message);
      return { paidAmount: 0, balance: 0 };
    }
  };

  // Function to search active packages by username
  const searchActivePackages = () => {
    return activePackages.filter((activePackage) =>
      activePackage.username
        .toLowerCase()
        .includes(searchUsername.toLowerCase())
    );
  };

  // Function to filter active packages by balance above 500
  const filterByBalanceAbove500 = (packages) => {
    return packages.filter((activePackage) => activePackage.balance > 500);
  };

  // Function to filter active packages by balance below 500
  const filterByBalanceBelow500 = (packages) => {
    return packages.filter((activePackage) => activePackage.balance <= 500);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Active Package Details", 10, 10);
    const filteredPackages = searchActivePackages();
    const above500 = filterByBalanceAbove500(filteredPackages);
    const below500 = filterByBalanceBelow500(filteredPackages);
    const sortedPackages = [...above500, ...below500];
    if (sortedPackages.length > 0) {
      const tableRows = sortedPackages.map((activePackage) => [
        activePackage._id,
        activePackage.username,
        activePackage.packageId._id,
        activePackage.packageId.name,
        activePackage.packageId.detail,
        activePackage.packageId.price,
        activePackage.packageId.validity,
        activePackage.paidAmount || 0,
        activePackage.balance || 0,
        <div>
          {/* Conditionally render buttons */}
          {activePackage.balance === 0 && activePackage.paidAmount === 0 && (
            <button
              className="btn btn-primary me-2"
              onClick={() =>
                handleAddButtonClick(
                  activePackage.userId,
                  activePackage.packageId._id,
                  activePackage.packageId.price
                )
              }
            >
              Add
            </button>
          )}
          {activePackage.balance > 0 && activePackage.paidAmount > 0 && (
            <button
              className="btn btn-warning"
              onClick={() =>
                handleEditButtonClick(
                  activePackage.userId,
                  activePackage.packageId._id,
                  activePackage.balance,
                  activePackage.paidAmount
                )
              }
            >
              Edit
            </button>
          )}
        </div>,
      ]);

      doc.autoTable({
        head: [
          [
            "Active Package ID",
            "User ID",
            "Package ID",
            "Package Name",
            "Package Detail",
            "Package Price",
            "Package Validity",
            "Paid Amount",
            "Balance",
            "Action",
          ],
        ],
        body: tableRows,
      });

      doc.save("active_packages_details.pdf");
    } else {
      toast.error("No active packages found");
    }
  };

  useEffect(() => {
    fetchActivePackages();
  }, []);

  // Fetch active package data from the server
  const fetchActivePackages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/active-pack/`);
      if (!response.ok) {
        throw new Error("Failed to fetch active packages");
      }
      const data = await response.json();
      const updatedActivePackages = await Promise.all(
        data.map(async (activePackage) => {
          try {
            const userResponse = await fetch(
              `http://localhost:5000/api/auth/${activePackage.userId}`
            );
            if (!userResponse.ok) {
              throw new Error(
                `Failed to fetch username for userId: ${activePackage.userId}`
              );
            }
            const userData = await userResponse.json();
            // Fetch paid amount and balance for this user
            const { paidAmount, balance } = await fetchPaidAmountAndBalance(
              activePackage.userId
            );
            return {
              ...activePackage,
              username: userData.username,
              paidAmount,
              balance,
            };
          } catch (error) {
            console.error(error);
            return activePackage;
          }
        })
      );
      setActivePackages(updatedActivePackages);
    } catch (error) {
      console.error("Error fetching active packages:", error.message);
      toast.error("Failed to fetch active packages");
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
        <h4 className="text-warning text-center">Active Package Details</h4>
        <div className="underline bg-warning w-100"></div>

        {/* Add search input field */}
        <div className="mt-3 w-25 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
        </div>

        <table className="table table-bordered mt-5">
          <thead className="bg-warning">
            <tr>
              <th scope="col">Active Package ID</th>
              <th scope="col">User Name</th>
              <th scope="col">Package ID</th>
              <th scope="col">Package Name</th>
              <th scope="col">Package Detail</th>
              <th scope="col">Package Price</th>
              <th scope="col">Package Validity</th>
              <th scope="col">Paid Amount</th>
              <th scope="col">Balance</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="box3">
            {/* Map over searchActivePackages() instead of activePackages */}
            {searchActivePackages().map((activePackage) => (
              <tr key={activePackage._id}>
                <td className="text-warning">{activePackage._id}</td>
                <td className="text-warning">{activePackage.username}</td>
                <td className="text-warning">{activePackage.packageId._id}</td>
                <td className="text-warning">{activePackage.packageId.name}</td>
                <td className="text-warning">
                  {activePackage.packageId.detail}
                </td>
                <td className="text-warning">
                  {activePackage.packageId.price}
                </td>
                <td className="text-warning">
                  {activePackage.packageId.validity}
                </td>
                <td className="text-warning">
                  {activePackage.paidAmount || 0}
                </td>
                <td className="text-warning">{activePackage.balance || 0}</td>
                <td className="text-warning">
                  <div>
                    {/* Conditionally render buttons */}
                    {activePackage.balance === 0 &&
                      activePackage.paidAmount === 0 && (
                        <button
                          className="btn btn-primary me-2"
                          onClick={() =>
                            handleAddButtonClick(
                              activePackage.userId,
                              activePackage.packageId._id,
                              activePackage.packageId.price
                            )
                          }
                        >
                          Add
                        </button>
                      )}
                    {activePackage.balance > 0 &&
                      activePackage.paidAmount > 0 && (
                        <button
                          className="btn btn-warning"
                          onClick={() =>
                            handleEditButtonClick(
                              activePackage.userId,
                              activePackage.packageId._id,
                              activePackage.balance,
                              activePackage.paidAmount
                            )
                          }
                        >
                          Edit
                        </button>
                      )}
                  </div>
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

      <ToastContainer />
    </div>
  );
}
