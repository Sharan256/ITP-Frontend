import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../UserNavbar";
import img5 from "../../img/back.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AllPackages() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };
  const [packages, setPackages] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // Track sort order

  const handlePrintButtonClick = () => {
    // Initialize jsPDF instance
    const doc = new jsPDF();

    // Define columns for the table
    const columns = [
      { header: "No", dataKey: "no" },
      { header: "Package Name", dataKey: "name" },
      { header: "Package Detail", dataKey: "detail" },
      { header: "Package Price", dataKey: "price" },
      { header: "Package Validity", dataKey: "validity" },
      { header: "Image URL", dataKey: "imgUrl" },
    ];

    // Extract table data from the state
    const data = packages.map((packageItem, index) => ({
      no: index + 1,
      name: packageItem.name,
      detail: packageItem.detail,
      price: packageItem.price,
      validity: packageItem.validity,
      imgUrl: packageItem.imgUrl,
    }));

    // Add table to the PDF document
    doc.autoTable({
      columns,
      body: data,
    });

    // Save the PDF document
    doc.save("packages.pdf");
  };

  // Fetch packages data from the server
  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/packages/");
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error.message);
      toast.error("Failed to fetch packages");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Delete package by ID
  const deletePackage = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/packages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete package");
      }
      toast.success("Package deleted successfully");
      fetchPackages(); // Refetch packages after deletion
    } catch (error) {
      console.error("Error deleting package:", error.message);
      toast.error("Failed to delete package");
    }
  };

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Sort packages by price: high to low
  const sortHighToLow = () => {
    const sortedPackages = [...packages].sort((a, b) => b.price - a.price);
    setPackages(sortedPackages);
    setSortOrder("highToLow");
  };

  // Sort packages by price: low to high
  const sortLowToHigh = () => {
    const sortedPackages = [...packages].sort((a, b) => a.price - b.price);
    setPackages(sortedPackages);
    setSortOrder("lowToHigh");
  };

  // Render packages after filtering based on searchInput
  const filteredPackages = packages.filter((packageItem) =>
    packageItem.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Apply sorting if sortOrder is set
  const sortedPackages =
    sortOrder === "highToLow"
      ? filteredPackages.sort((a, b) => b.price - a.price)
      : sortOrder === "lowToHigh"
      ? filteredPackages.sort((a, b) => a.price - b.price)
      : filteredPackages;

  return (
    <div>
      <AdminNavbar />
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
        <div className="d-flex align-items-center">
          <h4 className="text-warning">All Packages</h4>
          <div className="ms-auto w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search Package"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        <div className="underline bg-warning"></div>
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-warning ms-2"
            onClick={() => handleButtonClick("/package")}
          >
            Create
          </button>

          <button className="btn btn-primary" onClick={handlePrintButtonClick}>
            Print
          </button>
          <button className="btn btn-primary" onClick={sortHighToLow}>
            Sort High to Low
          </button>
          <button className="btn btn-primary" onClick={sortLowToHigh}>
            Sort Low to High
          </button>
        </div>
        <table className="table table-bordered mt-3">
          <thead className="table bg-warning">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Package Name</th>
              <th scope="col">Package Detail</th>
              <th scope="col">Package Price</th>
              <th scope="col">Package Validity</th>
              <th scope="col">Image URL</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="box3">
            {sortedPackages.map((packageItem, index) => (
              <tr key={packageItem._id}>
                <th className="text-warning " scope="row">
                  {index + 1}
                </th>
                <td className="text-warning">{packageItem.name}</td>
                <td className="text-warning">{packageItem.detail}</td>
                <td className="text-warning">{packageItem.price}</td>
                <td className="text-warning">{packageItem.validity}</td>
                <td className="text-warning">{packageItem.imgUrl}</td>
                <td>
                  <button
                    className="btn btn-warning ms-2"
                    onClick={() =>
                      navigate(`/edit-package/${packageItem._id}`, {
                        state: { user },
                      })
                    }
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => deletePackage(packageItem._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn btn-warning  ms-2"
          onClick={() => handleButtonClick("/admin-home")}
        >
          BACK
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
