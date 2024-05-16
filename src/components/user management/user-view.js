import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../UserNavbar";
import img5 from "../../img/back.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Traineraddview() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path, { state: { user } });
  };

  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/user`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      toast.error("Failed to fetch user details");
    }
  };

  const handlePrintButtonClick = () => {
    const doc = new jsPDF();
    doc.text("User Details Report", 10, 10);
    const data = userData.map((user) => [
      user.username,
      user.email,
      user.gender,
      user.weight,
      user.height,
    ]);
    const columns = ["Username", "Email", "Gender", "Weight", "Height"];
    doc.autoTable({
      head: [columns],
      body: data,
    });
    doc.save("user_details_report.pdf");
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      fetchUserDetails();
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const filteredUsers = userData
    ? userData.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const sortedUsers = sortOption
    ? filteredUsers
        .slice()
        .sort((a, b) =>
          sortOption === "asc"
            ? a.gender.localeCompare(b.gender)
            : b.gender.localeCompare(a.gender)
        )
    : filteredUsers;

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
        <h4 className="text-warning text-center">User Details</h4>
        <div className="underline bg-warning w-100"></div>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <select
              value={sortOption}
              onChange={handleSort}
              className="form-select"
            >
              <option value="">Sort by gender</option>
              <option value="asc">female</option>
              <option value="desc">male</option>
            </select>
          </div>
        </div>

        {userData && (
          <table className="table table-bordered mt-3">
            <thead className="bg-warning">
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Gender</th>
                <th scope="col">Weight</th>
                <th scope="col">Height</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="box3">
              {sortedUsers.map((user) => (
                <tr key={user._id}>
                  <td className="text-warning">{user.username}</td>
                  <td className="text-warning">{user.email}</td>
                  <td className="text-warning">{user.gender}</td>
                  <td className="text-warning">{user.weight}</td>
                  <td className="text-warning">{user.height}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="card-body text-center">
        <button
          className="btn btn-warning ms-auto"
          style={{ marginRight: "10px" }}
          onClick={handlePrintButtonClick}
        >
          Print
        </button>
        <button
          className="btn btn-warning ms-auto"
          onClick={() => handleButtonClick("/admin-home")}
        >
          BACK
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
