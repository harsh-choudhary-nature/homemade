"use client"; // we need client here because of interactions & uploads

import { useUser } from "@/contexts/UserContext";
import { useState, useRef } from "react";

export default function Profile() {

  const { user } = useUser();
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(user.profilePictureUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Upload handler - simulate
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // TODO: Upload file to server here and get URL
    // For now, create a local preview
    const url = URL.createObjectURL(file);
    setProfilePic(url);
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);

    // TODO: call API to update username/password/profilePic
    // Simulate delay
    await new Promise((r) => setTimeout(r, 1000));

    setIsSaving(false);
    setMessage("Profile updated successfully!");
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    // TODO: call API to delete account

    alert("Account deleted. You will be logged out.");
    // TODO: redirect to login or home after deletion
  }

  const firstLetter = username?.[0]?.toUpperCase() || "?";

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center" style={{ color: "var(--text-color)" }}>
        Your Profile
      </h1>

      {/* Profile Picture */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border border-gray-300"
          />
        ) : (
          <div
            className="rounded-full w-32 h-32 flex items-center justify-center bg-gray-400 text-6xl font-bold text-white select-none"
            style={{ color: "var(--text-color)" }}
          >
            {firstLetter}
          </div>
        )}

        {/* Pencil Icon Overlay */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-accent-color hover:bg-accent-color/80 text-white rounded-full p-2 shadow-lg focus:outline-none"
          aria-label="Change profile picture"
          style={{ backgroundColor: "var(--accent-color)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path d="M15.232 5.232l3.536 3.536M16.5 4.5a2.121 2.121 0 0 1 3 3L7 20.5H4v-3L16.5 4.5z" />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Username */}
      <div className="form-group">
        <label htmlFor="username" style={{ color: "var(--text-color)" }}>
          Username
        </label>
        <input
          id="username"
          type="text"
          className="form-group input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter new username"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
            borderColor: "var(--nav-border-color)",
          }}
        />
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="password" style={{ color: "var(--text-color)" }}>
          New Password
        </label>
        <input
          id="password"
          type="password"
          className="form-group input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
            borderColor: "var(--nav-border-color)",
          }}
        />
      </div>

      {/* Save Button */}
      <button
        className="signup-button login-button"
        onClick={handleSave}
        disabled={isSaving}
        style={{ marginTop: "1rem" }}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <div className="success-message" style={{ marginTop: "10px" }}>
          {message}
        </div>
      )}

      {/* Delete Account */}
      <button
        className="signup-button login-button"
        style={{
          marginTop: "2rem",
          backgroundColor: "var(--link-color)",
          color: "var(--primary-color)",
          fontWeight: "bold",
        }}
        onClick={handleDelete}
      >
        Delete Account
      </button>
    </main>
  );
}
