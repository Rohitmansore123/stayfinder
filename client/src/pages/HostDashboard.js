import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import styles from "./HostDashboard.module.css";

// HostDashboard Component
// Allows host to view, edit, and delete their listings
function HostDashboard() {
  const [listings, setListings] = useState([]); // Property listing array
  const [msg, setMsg] = useState(""); // Success/error message
  const navigate = useNavigate();

  // Fetch all listings when dashboard is loaded
  useEffect(() => {
    API.get("/listings/my")
      .then((res) => setListings(res.data))
      .catch(() => setMsg("Failed to load listings."));
  }, []);

  // Delete a listing with confirmation dialog
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );
    if (!confirmed) return;

    try {
      await API.delete(`/listings/${id}`);
      setListings(listings.filter((l) => l._id !== id));
      setMsg("Listing deleted successfully.");
    } catch {
      setMsg("Failed to delete listing.");
    }
  };

  // Navigate to edit page with listing ID
  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Listings</h2>

      {/* Show feedback message if available */}
      {msg && (
        <div
          className={`alert ${
            msg.toLowerCase().includes("fail")
              ? "alert-danger"
              : "alert-success"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Listings table */}
      <div className="table-responsive">
        <table
          className={`table table-striped table-hover border ${styles.hostTable}`}
        >
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th className={styles.actionsCol}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No listings found.
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing._id}>
                  <td>{listing.title}</td>
                  <td>{listing.location}</td>
                  <td>${listing.price}</td>
                  <td>
                    <button
                      className={`btn btn-sm btn-outline-primary me-2 ${styles.smallButton}`}
                      onClick={() => handleEdit(listing._id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn btn-sm btn-outline-danger ${styles.smallButton}`}
                      onClick={() => handleDelete(listing._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HostDashboard;
