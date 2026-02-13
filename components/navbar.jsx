"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavbar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const linkBase =
    "flex-1 flex flex-col items-center justify-center text-md md:text-lg font-medium transition-all duration-200 relative";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md">
      <div className="flex h-16">
        <Link
          href="/"
          className={`${linkBase} ${
            isActive("/")
              ? "text-indigo-600"
              : "text-gray-500 hover:text-indigo-500"
          }`}
        >
          {isActive("/") && (
            <span className="absolute top-0 h-1 w-10 bg-indigo-600 rounded-full" />
          )}
          <span>Home</span>
        </Link>

        {/* Divider */}
        <div className="w-px bg-gray-200 my-3" />

        <Link
          href="/profile"
          className={`${linkBase} ${
            isActive("/profile")
              ? "text-indigo-600"
              : "text-gray-500 hover:text-indigo-500"
          }`}
        >
          {isActive("/profile") && (
            <span className="absolute top-0 h-1 w-10 bg-indigo-600 rounded-full" />
          )}
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
