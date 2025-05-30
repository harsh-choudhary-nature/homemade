"use client"; // we need client here because of interactions & uploads

import { useUser } from "@/contexts/UserContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // use next/navigation for app router
import Edit from "@/components/Icons/Edit";


export default function Profile() {

  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const [username, setUsername] = useState(user?.username);
  const [tempUsername, setTempUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [profilePic, setProfilePic] = useState(user?.profilePictureUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
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
    <main className={`max-w-lg mx-auto p-6 bg-${"var(--secondary-color)"} rounded-xl shadow-lg`} style={{
      backgroundColor: "var(--secondary-color)",
      flexGrow: 0,

    }}>
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
        <Edit onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-accent-color hover:bg-accent-color/80 text-white rounded-full p-2 shadow-lg focus:outline-none transition duration-200 transform hover:scale-105 active:scale-90"
          ariaLabel="Change profile picture"
          style={{ backgroundColor: "var(--accent-color)" }} />
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
            marginBottom: "0.5rem",
          }}
          disabled={!isEditingUsername}
        />
        <div className="text-sm mt-0">
          {!isEditingUsername ? (
            <button
              type="button"
              className="text-blue-500 hover:underline"
              style={{ color: "var(--accent-color)" }}
              onClick={() => {
                setTempUsername(username); // store the current value temporarily
                setIsEditingUsername(true);
              }}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                className="text-green-600 hover:underline mr-4"
                onClick={() => {
                  // Dummy save handler
                  console.log("Saved:", username);
                  setIsEditingUsername(false);
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="text-red-500 hover:underline"
                onClick={() => {
                  setUsername(tempUsername); // revert to previous value
                  setIsEditingUsername(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Username */}
      <div className="form-group">
        <label htmlFor="email" style={{ color: "var(--text-color)" }}>
          Email
        </label>
        <input
          id="email"
          type="text"
          className="form-group input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
            borderColor: "var(--nav-border-color)",
          }}
          disabled={true}
        />
      </div>


      <div className="flex justify-between gap-4 mt-6">
        <button
          className="flex-1 signup-button login-button"
          onClick={() => router.push("/change-password")}
          style={{ fontWeight: "bold" }}
        >
          Change Password
        </button>

        <button
          className="flex-1 signup-button login-button"
          style={{
            backgroundColor: "var(--failure-color)",
            fontWeight: "bold",
          }}
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </main>
  );
}
