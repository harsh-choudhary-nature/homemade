"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import LoaderComponent from "../components/Loader";

const LoginPage = () => {
  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    if (!formData.email || !formData.password) {
      setLoading(false);
      setError("Please enter valid email and password.");
      return;
    }

    try {
      // Replace with your backend login URL
      const URL = process.env.REACT_APP_BACKEND_ROOT_URL || "http://localhost:5000";
      const response = await axios.post(`${URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Save tokens to localStorage or cookies (optional, depending on your strategy)
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);

      if (err.response) {
        // Display server-provided error message
        setError(err.response.data.error || "An error occurred during login.");
      } else {
        // Handle unexpected errors
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <div className="form-group">
          <label htmlFor="email">Email<span className="required">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password<span className="required">*</span></label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </button>
        <p className="signup-prompt">
          Don't have an account?&nbsp; <Link to="/signup" style={{ pointerEvents: loading ? "none" : "auto", color: loading ? "gray" : "" }}>
            Sign Up
          </Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {loading && <LoaderComponent />}
      </form>
    </div>
  );
};

export default LoginPage;