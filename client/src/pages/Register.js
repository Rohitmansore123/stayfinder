import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import styles from "./AuthForm.module.css";

function Register() {
  // Form state for user input
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to register user
      const res = await API.post("/auth/register", form);
      login(res.data.token, res.data.user);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      // Show specific error if user already exists
      if (
        err.response &&
        err.response.data &&
        err.response.data.message === "User already exists"
      ) {
        toast.error("User already registered with this email!");
      } else {
        toast.error("Registration failed!");
      }
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <div className={styles.authCard}>
        <div className={`card shadow-sm border-0 p-4 ${styles.formCard}`}>
          <h3 className={`text-center mb-4 ${styles.authTitle}`}>
            Register on StayFinder
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="form-label">I want to join as:</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">Guest (Book stays)</option>
                <option value="host">Host (List properties)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
