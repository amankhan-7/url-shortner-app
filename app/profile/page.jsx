"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavbar from "@/components/navbar";
import { fetchWithAuth } from "@/backend/lib/refereshToken";
import { ProfileLoader } from "@/components/loading";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const [open, setOpen] = useState(false);


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
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/change-password", {
        method: "GET",
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

 async function changePassword(e) {
  e.preventDefault();

  if (
    !passwords.currentPassword ||
    !passwords.newPassword ||
    !passwords.confirmPassword
  ) {
    toast.error("All fields are required");
    return;
  }

  if (passwords.newPassword !== passwords.confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  if (passwords.newPassword.length < 8) {
    toast.error("Password must be at least 8 characters long");
    return;
  }

  setChanging(true);

  const loadingToast = toast.loading("Updating password...");

  try {
    const res = await fetchWithAuth("/api/change-password", {
      method: "POST",
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

    toast.success("Password updated successfully", {
      id: loadingToast,
    });

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setOpen(false); // close dropdown after success (clean UX)
  } catch (err) {
    toast.error(err.message || "Something went wrong", {
      id: loadingToast,
    });
  } finally {
    setChanging(false);
  }
}
async function changePassword(e) {
  e.preventDefault();

  if (
    !passwords.currentPassword ||
    !passwords.newPassword ||
    !passwords.confirmPassword
  ) {
    toast.error("All fields are required");
    return;
  }

  if (passwords.newPassword !== passwords.confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  if (passwords.newPassword.length < 8) {
    toast.error("Password must be at least 8 characters long");
    return;
  }

  setChanging(true);

  const loadingToast = toast.loading("Updating password...");

  try {
    const res = await fetchWithAuth("/api/change-password", {
      method: "POST",
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

    toast.success("Password updated successfully", {
      id: loadingToast,
    });

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setOpen(false); // close dropdown after success (clean UX)
  } catch (err) {
    toast.error(err.message || "Something went wrong", {
      id: loadingToast,
    });
  } finally {
    setChanging(false);
  }
}

async function changePassword(e) {
  e.preventDefault();

  if (
    !passwords.currentPassword ||
    !passwords.newPassword ||
    !passwords.confirmPassword
  ) {
    toast.error("All fields are required");
    return;
  }

  if (passwords.newPassword !== passwords.confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  if (passwords.newPassword.length < 8) {
    toast.error("Password must be at least 8 characters long");
    return;
  }

  setChanging(true);

  const loadingToast = toast.loading("Updating password...");

  try {
    const res = await fetchWithAuth("/api/change-password", {
      method: "POST",
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

    toast.success("Password updated successfully", {
      id: loadingToast,
    });

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setOpen(false); // close dropdown after success (clean UX)
  } catch (err) {
    toast.error(err.message || "Something went wrong", {
      id: loadingToast,
    });
  } finally {
    setChanging(false);
  }
}


const router = useRouter();

  async function handleLogout() {
    // fetching api that clears the cookie
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    toast.success("Logged out",);
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

        {!loading ? (
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
        ) : (
          <ProfileLoader />
        )}

        {/* Change Password */}
        {/* Change Password Dropdown */}
<div className="border border-gray-200 rounded-lg overflow-hidden">
  {/* Trigger */}
  <button
    type="button"
    onClick={() => setOpen(!open)}
    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
  >
    <span className="text-sm font-semibold text-gray-800">
      Change Password
    </span>

    <motion.div
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <ChevronDown className="w-4 h-4 text-gray-600" />
    </motion.div>
  </button>

  {/* Animated Content */}
  <AnimatePresence initial={false}>
    {open && (
      <motion.div
        key="content"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <form
          onSubmit={changePassword}
          className="px-4 py-4 space-y-4 bg-white"
        >
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={changing}
            className="w-full bg-indigo-500 text-white text-sm font-semibold py-2 rounded-md hover:bg-indigo-600 disabled:opacity-60 transition"
          >
            {changing ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>
    )}
  </AnimatePresence>
</div>


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
