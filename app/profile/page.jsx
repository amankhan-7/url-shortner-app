"use client";

import { useEffect, useState } from "react";
import BottomNavbar from "@/components/navbar";

export default function ProfilePage() {
  // Pretend this comes from DB / API

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  async function fetchDetails() {
    try {
      const res = await fetch("/api/change-password", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      setUser({
        name: data.user.name,
        email: data.user.email,
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  async function changePassword(e) {
    e.preventDefault(); //  REQUIRED

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      alert("Password updated successfully");

      // Optional: clear form
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 mt-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-4 md:p-10 mb-20">
        <h1 className="text-3xl font-bold text-indigo-500 mb-8 text-center">
          Profile
        </h1>

        {/* User Info */}
        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Change Password */}
        <form onSubmit={changePassword} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 "
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              placeholder="*********"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 "
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 "
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            Update Password
          </button>
        </form>
      </div>
      <BottomNavbar />
    </div>
  );
}
