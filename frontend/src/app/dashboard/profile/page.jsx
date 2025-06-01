"use client"; // we need client here because of interactions & uploads

import { useUser } from "@/contexts/UserContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // use next/navigation for app router
import Edit from "@/components/Icons/Edit";
import Loader from "@/components/Loader/Loader";


export default function Profile() {

  const { user, login } = useUser();
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
  const [tempProfilePic, setTempProfilePic] = useState(user?.profilePictureUrl || null);
  const [tempProfilePicFile, setTempProfilePicFile] = useState(null);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [isViewingFullImage, setIsViewingFullImage] = useState(false);


  const [isSaving, setIsSaving] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const fileInputRef = useRef(null);

  function handleProfilePicEditClick() {
    if (isEditingProfilePic) {
      setMessageError("Please save or cancel the last changes.");
      return;
    }

    setMessageError(null); // clear old errors
    fileInputRef.current.click();
  }

  async function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsEditingProfilePic(true);
    const url = URL.createObjectURL(file);
    setTempProfilePicFile(file);
    setProfilePic(url);
  }

  async function handleUploadProfilePic() {
    if (!tempProfilePicFile) {
      setMessageError("No file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", tempProfilePicFile);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/dashboard/user/profile-picture`, {
        method: "POST",
        headers: {
        }, credentials: 'include', // send cookies!,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      URL.revokeObjectURL(profilePic);
      setProfilePic(data.profilePictureUrl); // Set the actual server URL
      setTempFile(null);
      setIsEditingProfilePic(false);
      setMessageSuccess("Profile picture updated");
      setMessageError(null);
      login({ ...user, profilePictureUrl: data.profilePictureUrl }); // Update user context
      console.log("Image saved");
    } catch (err) {
      console.error(err);
      setMessageError("Failed to upload image");
    }
  }

  async function handleSaveUsername() {
    setIsSaving(true);
    setMessageError(null);
    setMessageSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/dashboard/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }, credentials: 'include', // send cookies!
        body: JSON.stringify({
          username,
        }),
      });
      console.log("res", res);
      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setIsSaving(false);
      setMessageSuccess("Profile updated successfully!");
      setIsEditingUsername(false);

      login({ ...user, username }); // Update user context
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      setMessageError("Update failed. Please try again.");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    // TODO: call API to delete account

    alert("Account deleted. You will be logged out.");
    // TODO: redirect to login or home after deletion
  }

  async function handleDownloadClick(profilePic) {
    try {
      const response = await fetch(profilePic);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      // Provide a default filename or extract from URL if possible
      const filename = profilePic.split("/").pop().split("?")[0] || "profile-pic.png";
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
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
            onClick={() => setIsViewingFullImage(true)}
          />
        ) : (
          <div
            className="rounded-full w-32 h-32 flex items-center justify-center bg-gray-400 text-6xl font-bold text-white select-none"
            style={{ color: "var(--text-color)" }}
          >
            {firstLetter}
          </div>
        )}

        {isViewingFullImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
            <div className="relative max-w-full max-h-full flex flex-col items-center justify-center">
              <img
                src={profilePic}
                alt="Full Profile"
                className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
              />
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
              <a
                href={profilePic}
                download
                className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-200 transition"
              >
                Download
              </a>
              <button
                onClick={() => setIsViewingFullImage(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Pencil Icon Overlay */}
        <Edit onClick={handleProfilePicEditClick}
          className="absolute bottom-0 right-0 bg-accent-color hover:bg-accent-color/80 text-white rounded-full p-2 shadow-lg focus:outline-none transition duration-200 transform hover:scale-105 active:scale-90"
          ariaLabel="Change profile picture"
          style={{ backgroundColor: "var(--accent-color)" }} disabled={false} />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePicChange}
          accept="image/*"
          className="hidden"
        />
        {/* Save / Cancel if new image selected */}
        {isEditingProfilePic && (
          <div className="text-sm mt-0 flex justify-center gap-x-4">
            <button
              className="text-green-600 hover:underline mr-4"
              onClick={handleUploadProfilePic}
            >
              Save
            </button>
            <button
              className="text-red-500 hover:underline"
              onClick={() => {
                setProfilePic(tempProfilePic); // Discard selected image
                console.log("Image change canceled");
                setIsEditingProfilePic(false);
                setMessageError(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
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
                onClick={handleSaveUsername}
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
      {messageError && (
        <div className="mt-4 text-sm text-red-600 text-left w-full">
          {messageError}
        </div>
      )}
      {messageSuccess && (
        <div className="mt-4 text-sm text-red-600 text-left w-full">
          {messageSuccess}
        </div>
      )}
      {isSaving && (
        <div className="mt-4 text-sm text-red-600 text-left w-full mx-auto">
          <Loader />
        </div>
      )}
    </main>
  );
}
