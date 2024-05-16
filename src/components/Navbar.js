import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./style.css";
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg  custom-color ">
      <div className="container">
        <Link className="navbar-brand  text-warning" to="/">
          POWER GYM
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item ">
              <NavLink className="nav-link text-warning" to="/">
                HOME
              </NavLink>
            </li>
            <li className="nav-item ">
              <NavLink className="nav-link text-warning" to="/about">
                ABOUT US
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-warning" to="/pro-view">
                PRODUCTS
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-warning" to="/pack-view">
                PACKAGES
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-warning" to="/login">
                LOGIN
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
