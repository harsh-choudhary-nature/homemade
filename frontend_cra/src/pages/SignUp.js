import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoaderComponent from '../components/Loader';


const SignupPage = () => {
  const URL = process.env.REACT_APP_BACKEND_ROOT_URL
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    // console.log(e)
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");   // Clear any previous errors
    setSuccess(""); // Clear any previous success messages

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      console.log(`${URL}/auth/signup`);
      setLoading(true);
      const response = await axios.post(`${URL}/auth/signup`, {
        email: formData.email,
        password: formData.password,
      });
      setLoading(false);
      setSuccess("Signup successful! Please check your email and verify your account!"); // Set success message
      setFormData({ email: "", password: "", confirmPassword: "" }); // Clear the form
      console.log("Signup response:", response.data);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.error || "An error occurred during signup."
      );
      console.error("Signup error:", err);
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password<span className="required">*</span></label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            disabled={loading}
            />
        </div>
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="login-prompt">
          Already have an account?&nbsp; 
          <Link to="/login" style={{ pointerEvents: loading ? "none" : "auto", color: loading ? "gray" : "" }}>
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
