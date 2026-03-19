import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Profile.module.css";

// Profile component to display logged-in user details
function Profile() {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState(""); // Error message if fetching fails
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch bookings once we have user
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoadingBookings(true);
      try {
        const res = await API.get("/bookings/me");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    const fetchFavorites = async () => {
      if (!user) return;
      setLoadingFavorites(true);
      try {
        const res = await API.get("/favorites");
        setFavorites(res.data);
      } catch (err) {
        // Ignore errors for favorites
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchBookings();
    fetchFavorites();
  }, [user]);

  // Function to become a host
  const becomeHost = async () => {
    try {
      const res = await API.put("/auth/profile", { role: "host" });
      updateUser(res.data);
      toast.success("You are now a host!");
    } catch (err) {
      toast.error("Failed to become host.");
    }
  };

  // Show loading or error message
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`container text-center ${styles.loadingSpinner}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading user info...</span>
        </div>
      </div>
    );
  }

  // Profile UI
  return (
    <div className={`container ${styles.profileContainer}`}>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites
          </button>
        </li>
      </ul>

      {activeTab === "profile" && (
        <div className={`card shadow-sm p-4 ${styles.profileCard}`}>
          <h3 className={styles.profileTitle}>Welcome, {user.name}!</h3>
          <p className={styles.profileInfo}>
            <strong>Email:</strong> {user.email}
          </p>
          <p className={styles.profileInfo}>
            <strong>Role:</strong> {user.role}
          </p>
          {user.role === "user" && (
            <button className="btn btn-primary" onClick={becomeHost}>
              Become a Host
            </button>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className={styles.bookingsSection}>
          <h4 className={styles.bookingsTitle}>Your Bookings</h4>
          {loadingBookings ? (
            <div className={styles.loadingSpinner}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading bookings...</span>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <p className={styles.noBookings}>No bookings yet.</p>
          ) : (
            <div className="list-group">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <h6 className="mb-1">
                      {booking.listing?.title || "Listing"}
                    </h6>
                    <p className="mb-1">
                      {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge bg-primary rounded-pill">
                    ${booking.totalPrice}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className={styles.bookingsSection}>
          <h4 className={styles.bookingsTitle}>Your Favorites</h4>
          {loadingFavorites ? (
            <div className={styles.loadingSpinner}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading favorites...</span>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <p className={styles.noBookings}>No favorites yet.</p>
          ) : (
            <div className="list-group">
              {favorites.map((fav) => (
                <div
                  key={fav._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <h6 className="mb-1">{fav.listing.title}</h6>
                    <p className="mb-1">{fav.listing.location}</p>
                  </div>
                  <span className="badge bg-secondary rounded-pill">
                    ${fav.listing.price}/night
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
