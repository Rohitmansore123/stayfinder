import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

// AddListing Component
// Renders a form to add a new property listing
function AddListing() {
  // Form state for listing data
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
  });

  // Images state
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Message for feedback (success/failure)
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // Handle changes in input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      let imageUrls = [];

      if (images.length > 0) {
        setUploading(true);
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));

        const uploadRes = await API.post("/listings/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrls = uploadRes.data.urls;
        setUploading(false);
      }

      await API.post("/listings", {
        title: form.title,
        location: form.location,
        price: parseFloat(form.price),
        description: form.description,
        images: imageUrls,
      });

      setMsg("Listing added successfully.");

      // Redirect to homepage after 1 second
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add listing. Please try again.";
      setMsg(errorMessage);
      setUploading(false);
    }
  };

  return (
    <div className="add-listing-container container mt-5">
      <h2 className="mb-4 text-center">Add New Property Listing</h2>

      {/* Add Listing Form */}
      <form onSubmit={handleSubmit} className="listing-form mx-auto">
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
          type="file"
          multiple
          accept="image/*"
          className="form-control mb-3"
          onChange={handleFileChange}
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
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add Listing"}
          </button>
        </div>
      </form>

      {/* Feedback Message */}
      {msg && <div className="alert mt-3 text-center">{msg}</div>}

      {/* Scoped Styling for this Component */}
      <style>
        {`
          .listing-form {
            max-width: 600px;
          }

          .add-listing-container input,
          .add-listing-container textarea {
            border-radius: 8px;
            border: 1px solid #ced4da;
          }

          .add-listing-container input:focus,
          .add-listing-container textarea:focus {
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

export default AddListing;
