import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaTh,
} from "react-icons/fa"; //  Icons for better UX
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  //  Logout function: remove token and redirect to login page
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
      <div className="container">
        {/*  Brand/Logo */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          🏠 StayFinder
        </Link>

        {/*  Toggle button for mobile screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/*  Navigation Links (collapsible) */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Always visible: Home link */}
            <li className="nav-item mx-1">
              <Link className="nav-link" to="/">
                <FaHome className="me-1" /> Home
              </Link>
            </li>

            {/* If logged in: show user-specific links */}
            {user ? (
              <>
                {/* Add Listing - only for hosts */}
                {user.role === "host" && (
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="/add-listing">
                      <FaPlus className="me-1" /> Add Listing
                    </Link>
                  </li>
                )}

                {/* Profile */}
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/profile">
                    <FaUser className="me-1" /> {user.name}
                  </Link>
                </li>

                {/* Host Dashboard - only for hosts */}
                {user.role === "host" && (
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="/dashboard">
                      <FaTh className="me-1" /> Dashboard
                    </Link>
                  </li>
                )}

                {/* Admin Dashboard - only for admins */}
                {user.role === "admin" && (
                  <li className="nav-item mx-1">
                    <Link className="nav-link" to="/admin">
                      <FaTh className="me-1" /> Admin
                    </Link>
                  </li>
                )}

                {/* Logout */}
                <li className="nav-item mx-1">
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/*  If not logged in: Login and Register */}
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/register">
                    <FaUserPlus className="me-1" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
