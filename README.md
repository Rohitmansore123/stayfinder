# 🏠 StayFinder – Rental App (Internship Assignment)

This is a full-stack web application created as an internship assignment. The app allows users to register, log in, view their profile, and manage property listings.

---

## 📌 Tech Stack

- **Frontend:** React, React Router, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT

---

## ✨ Features Implemented

- 🔐 User Authentication (Register/Login)
- 👤 Profile Page (Authenticated route)
- ➕ Add/Edit/Delete Listing (Protected)
- 🧭 Host Dashboard for managing listings
- 🛏️ Bookings (Create & View)
- 🔍 Search & Filters (location, price)
- 🗺️ Map Integration (Google Maps)
- 💳 Mock Payment
- ⭐ Reviews & Ratings (Users can review listings)
- ❤️ Favorites/Wishlist (Users can save favorite listings)
- 🚫 404 Page & Route Handling
- 🎨 Responsive Design (Bootstrap)

---

## 📁 Project Structure

```
stayfinder/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable React components (Navbar, Footer, PropertyCard, etc.)
│       ├── pages/           # Page components (Home, Login, Register, ListingDetail, etc.)
│       ├── utils/           # Utility files (api.js)
│       ├── App.js
│       ├── index.js
│       └── ...              # CSS files, assets, etc.
├── server/                  # Express backend
│   ├── config/              # DB config (db.js)
│   ├── controllers/         # Route controllers (authController.js, listingController.js, etc.)
│   ├── middleware/          # Middleware (authMiddleware.js)
│   ├── models/              # Mongoose models (User.js, Listing.js, Booking.js)
│   ├── routes/              # Express routes (auth.js, listings.js, bookings.js, user.js)
│   ├── server.js            # Main server file
│   └── ...                  # Other backend files
├── .env                     # Environment config (Mongo URI, JWT secret, etc.)
├── package.json             # Root scripts (concurrently, etc.)
└── README.md                # Project documentation
```

---

## ⚙️ Running the App Locally

> Make sure MongoDB is installed and running.

1. **Extract the zip file and open the project folder**

   ```bash
   cd stayfinder
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   npm start
   ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Open browser at:** [http://localhost:3000](http://localhost:3000)

---

### **.env Configuration (server/.env)**

```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
```

---

## 🧠 Prompt Answers

**1. What tech stack did you choose and why?**

- **Frontend:** React – Because it is fast, component-based, and popular for building modern UIs.
- **Backend:** Node.js + Express – Because it is asynchronous, scalable, and ideal for REST APIs.
- **Database:** MongoDB – For its flexible schema and easy integration.
- **Styling:** Bootstrap – For quick and responsive design.

**2. Are you comfortable building both frontend and backend if UI is provided?**  
Yes, I am comfortable building both frontend and backend. If the UI is provided, I can integrate it with backend APIs.

**3. Suggest 2 unique features you’d add to improve Airbnb.**

- **Instant WhatsApp Chat:** Direct WhatsApp chat integration between guest and host for quick query resolution.
- **Verified Property Badges:** Properties verified by admin receive a badge, increasing user trust.

**4. Briefly explain how you’d secure and scale the app.**

- **Security:** JWT authentication, password hashing (bcrypt), HTTPS, environment variables, input validation, CORS, protected routes.
- **Scaling:** Cloud database (MongoDB Atlas), scalable deployment (Render/AWS), CDN for static files, caching (Redis), load balancer use karna.

---

**👨‍💻 Developed By**  
Rohit Mansore  
Email: rohitmansore007@gmail.com  
GitHub: [rohitmansore12](https://github.com/rohitmansore12)
