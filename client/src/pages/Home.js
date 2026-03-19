import React, { useEffect, useState } from "react";
import API from "../utils/api";
import PropertyCard from "../components/PropertyCard";

// Home Component
// Displays all property listings with optional filters (location, price range)
function Home() {
  const [listings, setListings] = useState([]); // List of fetched properties
  const [error, setError] = useState(""); // Error message if API fails
  const [loading, setLoading] = useState(false); // Loading state for listings
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    amenities: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch listings from API with optional query filters
  const fetchListings = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 10 };
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.amenities) params.amenities = filters.amenities;
      if (filters.sort) params.sort = filters.sort;

      const res = await API.get("/listings", { params });
      let listingsData, totalPagesData, currentPageData;
      if (Array.isArray(res.data)) {
        listingsData = res.data;
        totalPagesData = 1;
        currentPageData = 1;
      } else {
        listingsData = res.data.listings;
        totalPagesData = res.data.totalPages;
        currentPageData = res.data.currentPage;
      }
      setListings(listingsData);
      setTotalPages(totalPagesData);
      setPage(currentPageData);
      setError("");
    } catch (err) {
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, []);

  // Update filters on input change
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle search/filter form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchListings(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchListings(newPage);
    }
  };

  return (
    <div className="home-page container mt-5">
      <h2 className="text-center mb-4">Explore Stays</h2>

      {/* Filter Form */}
      <form className="row g-3 mb-4 filter-form" onSubmit={handleSearch}>
        <div className="col-md-4">
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Search by location"
            value={filters.location}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="minPrice"
            className="form-control"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="maxPrice"
            className="form-control"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="minRating"
            min="0"
            max="5"
            step="0.1"
            className="form-control"
            placeholder="Min Rating"
            value={filters.minRating}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="amenities"
            className="form-control"
            placeholder="Amenities (comma separated)"
            value={filters.amenities}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="sort"
            value={filters.sort}
            onChange={handleChange}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Best Rating</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            Search
          </button>
        </div>
      </form>

      {/* Error message if API fails */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Property Listings Grid */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {listings.length === 0 ? (
            <p className="text-center text-muted">No listings found.</p>
          ) : (
            listings.map((property) => (
              <div className="col-md-4 mb-4" key={property._id}>
                <PropertyCard property={property} />
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <li
                  key={pageNum}
                  className={`page-item ${page === pageNum ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              ),
            )}
            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Scoped Styling */}
      <style>
        {`
          .filter-form input {
            border-radius: 8px;
            border: 1px solid #ccc;
          }

          .filter-form input:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          }

          .home-page h2 {
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
