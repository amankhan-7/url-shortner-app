"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavbar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-gray-800 shadow-2xl">
      <div className="flex justify-around items-center h-14">
        <Link
          href="/"
          className={`flex flex-col font-semibold items-center text-sm ${
            isActive("/") ? "text-indigo-500" : "text-gray-500"
          }`}
        >
          <span>Home</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center text-sm font-medium ${
            isActive("/profile") ? "text-indigo-500" : "text-gray-500"
          }`}
        >
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
