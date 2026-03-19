import React from "react";

// Footer Component
// Displays site copyright info
function Footer() {
  return (
    <>
      <footer className="footer">
        StayFinder &copy; {new Date().getFullYear()}
      </footer>

      {/* Scoped Footer CSS */}
      <style>
        {`
          .footer {
            background-color: #212529;
            color: #ffffff;
            text-align: center;
            padding: 1rem;
            margin-top: 3rem;
            font-size: 0.95rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          @media (max-width: 768px) {
            .footer {
              font-size: 0.85rem;
              padding: 0.8rem;
            }
          }
        `}
      </style>
    </>
  );
}

export default Footer;
