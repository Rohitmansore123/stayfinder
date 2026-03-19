import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import styles from "./AuthForm.module.css";

function Login() {
  // Form state for user input
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Show session-expired notice (if redirected due to 401)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("sessionExpired")) {
      toast.warn("Session expired. Please log in again.");
    }
  }, [location.search]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to login user
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.user);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      // Show specific error for wrong email or password
      if (
        err.response &&
        err.response.data &&
        err.response.data.message === "Invalid credentials"
      ) {
        toast.error("Wrong email or password!");
      } else {
        toast.error("Login failed!");
      }
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <div className={styles.authCard}>
        <div className={`card shadow-sm border-0 p-4 ${styles.formCard}`}>
          <h3 className={`text-center mb-4 ${styles.authTitle}`}>
            Login to StayFinder
          </h3>

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
