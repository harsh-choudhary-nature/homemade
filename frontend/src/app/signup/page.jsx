"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import LoaderComponent from '@/components/Loader';
import styles from './Signup.module.css';

const SignupPage = () => {
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL || "http://localhost:5000";
  const [formData, setFormData] = useState({ username: '', email: '', password: '', otp: '' });
  const [otpSent, setOtpSent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create refs for each OTP input
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const newOtp = formData.otp.split('');
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp.join('') });

    // Move to the next OTP input if the current input has a value
    if (value && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  const sendOtp = async () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${URL}/api/signup/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      setOtpSent(true);
      setSuccess(data.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { username, email, password, otp } = formData;

    if (!username.trim() || !email.trim() || !password.trim() || !otp.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${URL}/api/signup/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      alert('Registration successful! Please log in.');
      router.replace('/login'); // Redirect to login page after successful registration
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
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
        {!otpSent ? (
          <button onClick={sendOtp} disabled={loading} className="signup-button">
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="otp0">
                OTP<span className="required">*</span>:{" "}
              </label>
              <div className={styles.otpContainer}>
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp${index}`}
                    id={`otp${index}`}
                    maxLength="1"
                    value={formData.otp[index] || ""}
                    onChange={(e) => handleOtpChange(e, index)}
                    ref={otpRefs[index]} // Assign the ref to each input
                    required
                  />
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="username">
                Username<span className="required">*</span>:{" "}
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                Password<span className="required">*</span>:{" "}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </>
        )}

        <p className="login-prompt">
          Already have an account?&nbsp;
          <Link href="/login" style={{ pointerEvents: loading ? "none" : "auto", color: loading ? "gray" : "" }}>
            Log in
          </Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {loading && <LoaderComponent />}
      </form>
    </div>
  );
};

export default SignupPage;
