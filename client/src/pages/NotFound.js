import React from "react";

// NotFound component for handling unmatched routes (404)
function NotFound() {
  return (
    <div className="container text-center mt-5">
      <div className="p-5 shadow-sm rounded bg-light">
        <h1 className="display-3 text-danger">404</h1>
        <h4 className="mb-3">Oops! Page Not Found</h4>
        <p>The page you are looking for doesn’t exist or has been moved.</p>
        <a href="/" className="btn btn-primary mt-3">
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
