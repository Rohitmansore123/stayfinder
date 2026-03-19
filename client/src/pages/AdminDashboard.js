import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  const fetchListings = async () => {
    try {
      const res = await API.get("/admin/listings");
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch listings");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "users" && users.length === 0) fetchUsers();
    if (tab === "listings" && listings.length === 0) fetchListings();
    if (tab === "bookings" && bookings.length === 0) fetchBookings();
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const deleteListing = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await API.delete(`/admin/listings/${listingId}`);
        fetchListings();
        fetchStats();
      } catch (err) {
        alert("Failed to delete listing");
      }
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="container mt-5 text-center">Access denied</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => handleTabChange("stats")}
          >
            Statistics
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => handleTabChange("users")}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "listings" ? "active" : ""}`}
            onClick={() => handleTabChange("listings")}
          >
            Listings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => handleTabChange("bookings")}
          >
            Bookings
          </button>
        </li>
      </ul>

      {activeTab === "stats" && (
        <div className="row">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{stats.users || 0}</h5>
                <p className="card-text">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{stats.listings || 0}</h5>
                <p className="card-text">Total Listings</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{stats.bookings || 0}</h5>
                <p className="card-text">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{stats.reviews || 0}</h5>
                <p className="card-text">Total Reviews</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={u.role}
                      onChange={(e) => updateUserRole(u._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="host">Host</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{/* Future actions */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "listings" && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Host</th>
                <th>Location</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l._id}>
                  <td>{l.title}</td>
                  <td>{l.host?.name || "Unknown"}</td>
                  <td>{l.location}</td>
                  <td>${l.price}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteListing(l._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>User</th>
                <th>Listing</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name || "Unknown"}</td>
                  <td>{b.listing?.title || "Unknown"}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>${b.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
