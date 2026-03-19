import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";

// EditListing Component
// Allows the user to update/edit an existing property listing
function EditListing() {
  const { id } = useParams(); // Get listing ID from URL
  const navigate = useNavigate(); // To redirect user after update

  // State for form data
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    image: "",
  });

  // State for success or error message
  const [msg, setMsg] = useState("");

  // Fetch listing details when component mounts
  useEffect(() => {
    API.get(`/listings/${id}`)
      .then((res) => {
        const data = res.data;
        setForm({
          title: data.title,
          location: data.location,
          price: data.price,
          description: data.description,
          image: data.images && data.images[0] ? data.images[0] : "",
        });
      })
      .catch(() => setMsg("Failed to load listing"));
  }, [id]);

  // Handle input field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await API.put(`/listings/${id}`, {
        title: form.title,
        location: form.location,
        price: form.price,
        description: form.description,
        images: form.image ? [form.image] : [],
      });

      setMsg("Listing updated successfully.");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMsg("Failed to update listing.");
    }
  };

  return (
    <div className="edit-listing-container container mt-5">
      <h2 className="mb-4 text-center">Edit Listing</h2>

      {/* Edit Listing Form */}
      <form onSubmit={handleSubmit} className="edit-form mx-auto">
        <input
          name="title"
          placeholder="Property Title"
          className="form-control mb-3"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          className="form-control mb-3"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price per Night"
          className="form-control mb-3"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="image"
          placeholder="Image URL"
          className="form-control mb-3"
          value={form.image}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Property Description"
          className="form-control mb-3"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />

        <div className="text-center">
          <button className="btn btn-primary w-100" type="submit">
            Update Listing
          </button>
        </div>
      </form>

      {/* Feedback Message */}
      {msg && <div className="alert mt-3 text-center">{msg}</div>}

      {/* Scoped Styling */}
      <style>
        {`
          .edit-form {
            max-width: 600px;
          }

          .edit-form input,
          .edit-form textarea {
            border-radius: 8px;
            border: 1px solid #ced4da;
          }

          .edit-form input:focus,
          .edit-form textarea:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          }

          .alert {
            background-color: #e9ecef;
            border: 1px solid #ccc;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 0.95rem;
          }
        `}
      </style>
    </div>
  );
}

export default EditListing;
