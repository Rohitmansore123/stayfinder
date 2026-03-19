import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import styles from "./PropertyCard.module.css";

// Component: PropertyCard
// Purpose: Shows property image, title, location, price, and link to details
function PropertyCard({ property }) {
  // Image fallback if no image is provided
  const imageUrl =
    (property.images && property.images.length > 0 && property.images[0]) ||
    "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";

  return (
    <div className={`card h-100 shadow-sm border-0 ${styles.propertyCard}`}>
      {/* Property Image */}
      <img
        src={imageUrl}
        className={`card-img-top rounded-top ${styles.cardImage}`}
        alt={property.title || "Property Image"}
      />

      {/* Card Body */}
      <div className="card-body d-flex flex-column p-3">
        {/* Property Title */}
        <h5 className="card-title text-dark">{property.title}</h5>

        {/* Property Location */}
        <p className="card-text text-muted mb-2 d-flex align-items-center">
          <FaMapMarkerAlt className="me-2 text-danger" />
          {property.location}
        </p>

        {/* Property Price */}
        <p className="card-text text-success fw-semibold mb-3 d-flex align-items-center">
          <FaDollarSign className="me-1" />
          {property.price}
          <span className="text-muted ms-1">/ night</span>
        </p>

        {/* View Details Button */}
        <Link
          to={`/listings/${property._id}`}
          className="btn btn-outline-primary mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PropertyCard;
