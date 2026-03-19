import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { FaHeart, FaComments } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ListingDetail.module.css";

// ListingDetail component shows details of a single listing and allows user to book it
function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ checkIn: "", checkOut: "" });
  const [bookingMsg, setBookingMsg] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Fetch listing data when page loads
  useEffect(() => {
    API.get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setError("Failed to load listing."));

    // Fetch reviews
    API.get(`/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => {}); // Ignore errors for reviews

    // Check if favorite
    API.get("/favorites")
      .then((res) => {
        const fav = res.data.find((f) => f.listing._id === id);
        setIsFavorite(!!fav);
      })
      .catch(() => {}); // Ignore if not logged in
  }, [id]);

  // Fetch messages when listing and user are available
  useEffect(() => {
    if (user && listing && listing.host !== user._id) {
      API.get(`/messages/${id}`)
        .then((res) => setMessages(res.data))
        .catch(() => {});
    }
  }, [user, listing, id]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle booking form submission
  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg("");

    try {
      await API.post("/bookings", {
        listing: listing._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
      });

      // Mock payment success
      setBookingMsg("Booking and payment successful! (Mock payment)");
    } catch (err) {
      setBookingMsg("Booking failed. Please login or try again.");
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        listing: listing._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      // Refresh reviews
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
      // Update listing rating
      const updatedListing = await API.get(`/listings/${id}`);
      setListing(updatedListing.data);
      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
    } catch (err) {
      alert(
        "Failed to submit review. You may have already reviewed this listing.",
      );
    }
  };

  // Handle favorite toggle
  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await API.delete(`/favorites/${id}`);
      } else {
        await API.post("/favorites", { listingId: id });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert("Please login to add to favorites.");
    }
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await API.post("/messages", {
        receiver: listing.host,
        listing: id,
        message: newMessage,
      });
      setNewMessage("");
      // Refresh messages
      const res = await API.get(`/messages/${id}`);
      setMessages(res.data);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  // Show error if listing not found
  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  // Show loading while data is being fetched
  if (!listing) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container">
      <div className={styles.listingContainer}>
        <h2 className={styles.listingTitle}>
          {listing.title}
          <button
            className={`btn btn-link p-0 ms-2 ${isFavorite ? "text-danger" : "text-muted"}`}
            onClick={handleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FaHeart size={24} />
          </button>
        </h2>

        {/* Image Gallery */}
        <div className={styles.imageGallery}>
          {listing.images && listing.images.length > 0 ? (
            <div className="row">
              {listing.images.map((img, index) => (
                <div key={index} className="col-md-4 mb-3">
                  <img
                    src={img}
                    alt={`${listing.title} ${index + 1}`}
                    className={`img-fluid rounded ${styles.galleryImage}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <img
              src="https://via.placeholder.com/600x400?text=No+Image"
              alt={listing.title}
              className={`img-fluid mb-3 rounded ${styles.mainImage}`}
            />
          )}
        </div>

        {/* Basic Info */}
        <p className={styles.basicInfo}>
          <strong>Location:</strong> {listing.location}
        </p>

        {/* Google Maps Iframe */}
        <div className={styles.mapsContainer}>
          <iframe
            title="map"
            className={styles.mapsIframe}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              listing.location,
            )}&output=embed`}
          ></iframe>
        </div>

        <p className={styles.basicInfo}>
          <strong>Price:</strong> ${listing.price} / night
        </p>
        <p>{listing.description}</p>

        <hr />

        {/* Booking Section */}
        <h4 className="mb-3">Book this stay</h4>
        <form onSubmit={handleBooking} className={styles.bookingForm}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-4 d-flex align-items-end mb-3">
              <button type="submit" className="btn btn-success w-100">
                Book Now
              </button>
            </div>
          </div>
        </form>

        {/* Booking Message */}
        {bookingMsg && (
          <div
            className={`alert ${
              bookingMsg.toLowerCase().includes("fail")
                ? `alert-danger ${styles.bookingMessageError}`
                : `alert-success ${styles.bookingMessageSuccess}`
            }`}
          >
            {bookingMsg}
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-5">
          <h4>Reviews ({reviews.length})</h4>
          {reviews.length > 0 && (
            <div className="mb-3">
              <strong>Average Rating: {listing?.rating || 0} ⭐</strong>
            </div>
          )}
          {reviews.map((review) => (
            <div key={review._id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <strong>{review.user.name}</strong>
                  <span>{"⭐".repeat(review.rating)}</span>
                </div>
                <p className="card-text">{review.comment}</p>
                <small className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mt-3">
              <div className="mb-3">
                <label>Rating:</label>
                <select
                  className="form-select"
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      rating: Number(e.target.value),
                    })
                  }
                >
                  <option value={5}>5 ⭐</option>
                  <option value={4}>4 ⭐</option>
                  <option value={3}>3 ⭐</option>
                  <option value={2}>2 ⭐</option>
                  <option value={1}>1 ⭐</option>
                </select>
              </div>
              <div className="mb-3">
                <label>Comment:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Chat Section */}
      {user && listing && listing.host !== user._id && (
        <div className="mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowChat(!showChat)}
          >
            <FaComments className="me-2" />
            {showChat ? "Close Chat" : "Contact Host"}
          </button>
          {showChat && (
            <div
              className="mt-3 border rounded p-3"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <h5>Chat with Host</h5>
              <div className="mb-3">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`mb-2 ${msg.sender._id === user._id ? "text-end" : ""}`}
                  >
                    <strong>{msg.sender.name}:</strong> {msg.message}
                    <small className="text-muted d-block">
                      {new Date(msg.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ListingDetail;
