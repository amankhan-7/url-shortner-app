"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  async function handleLogout() {
    // fetching api that clears the cookie
    await fetch("/api/logout", {
      method: "POST",
    });
    // Redirect to login page
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 -mt-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-indigo-500 text-center">
            Profile Settings
          </h1>
        </div>

        {/* Readonly Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-gray-500">Full Name</p>
            <p className="mt-1 text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Email Address</p>
            <p className="mt-1 text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
              {user.email}
            </p>
          </div>
        </div>

        {/* Change Password */}
        <form onSubmit={changePassword} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Change Password
          </h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              placeholder="••••••••"
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              placeholder="••••••••"
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              placeholder="••••••••"
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white text-sm font-semibold py-2 rounded-md hover:bg-indigo-600 transition cursor-pointer"
          >
            Update Password
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium border-2 bg-red-500 text-white border-red-600 rounded-md cursor-pointer"
        >
          Logout
        </button>
      </div>

      <BottomNavbar />
    </div>
  );
}
