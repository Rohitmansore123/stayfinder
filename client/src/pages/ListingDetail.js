import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { FaHeart, FaComments } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ListingDetail.module.css";

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

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setError("Failed to load listing."));

    API.get(`/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => {});

    API.get("/favorites")
      .then((res) => {
        const fav = res.data.find((f) => f.listing._id === id);
        setIsFavorite(!!fav);
      })
      .catch(() => {});
  }, [id]);

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

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg("");

    try {
      await API.post("/bookings", {
        listing: listing._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
      });

      setBookingMsg("Booking and payment successful! (Mock payment)");
    } catch (err) {
      setBookingMsg("Booking failed. Please login or try again.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        listing: listing._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);

      const updatedListing = await API.get(`/listings/${id}`);
      setListing(updatedListing.data);

      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
    } catch (err) {
      alert("You already reviewed this listing.");
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await API.delete(`/favorites/${id}`);
      } else {
        await API.post("/favorites", { listingId: id });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert("Login required");
    }
  };

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
      const res = await API.get(`/messages/${id}`);
      setMessages(res.data);
    } catch {
      alert("Message failed");
    }
  };

  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!listing) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container">
      <div className={styles.listingContainer}>
        <h2>
          {listing.title}
          <button
            className={`btn btn-link ms-2 ${
              isFavorite ? "text-danger" : "text-muted"
            }`}
            onClick={handleFavorite}
          >
            <FaHeart size={24} />
          </button>
        </h2>

        {/* ✅ SIDE BY SIDE SECTION */}
        <div className="row mt-3">
          {/* LEFT - IMAGES */}
          <div className="col-md-6">
            {listing.images && listing.images.length > 0 ? (
              <div className="row">
                {listing.images.map((img, i) => (
                  <div key={i} className="col-6 mb-3">
                    <img
                      src={img}
                      alt=""
                      className="img-fluid rounded"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <img
                src="https://via.placeholder.com/600x400"
                className="img-fluid rounded"
                alt=""
              />
            )}
          </div>

          {/* RIGHT - MAP */}
          <div className="col-md-6">
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                listing.location,
              )}&output=embed`}
              width="100%"
              height="100%"
              style={{ minHeight: "320px", border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <p className="mt-3">
          <strong>Location:</strong> {listing.location}
        </p>

        <p>
          <strong>Price:</strong> ${listing.price} / night
        </p>

        <p>{listing.description}</p>

        <hr />

        {/* BOOKING */}
        <h4>Book this stay</h4>
        <form onSubmit={handleBooking}>
          <div className="row">
            <div className="col-md-4">
              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4">
              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4">
              <button className="btn btn-success w-100">Book Now</button>
            </div>
          </div>
        </form>

        {bookingMsg && <div className="alert mt-3">{bookingMsg}</div>}

        {/* REVIEWS */}
        <div className="mt-5">
          <h4>Reviews ({reviews.length})</h4>

          {reviews.map((r) => (
            <div key={r._id} className="card mb-2">
              <div className="card-body">
                <strong>{r.user.name}</strong>
                <p>{r.comment}</p>
              </div>
            </div>
          ))}

          <button
            className="btn btn-outline-primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write Review
          </button>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mt-3">
              <textarea
                className="form-control"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                required
              />
              <button className="btn btn-primary mt-2">Submit</button>
            </form>
          )}
        </div>
      </div>

      {/* CHAT */}
      {user && listing.host !== user._id && (
        <div className="mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowChat(!showChat)}
          >
            <FaComments /> Chat
          </button>

          {showChat && (
            <div className="mt-3 border p-3">
              {messages.map((m) => (
                <div key={m._id}>
                  <strong>{m.sender.name}:</strong> {m.message}
                </div>
              ))}

              <form onSubmit={handleSendMessage}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="form-control mt-2"
                />
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ListingDetail;
