"use client";

import { useState, useEffect } from "react";
import BottomNavbar from "@/components/navbar";
import { DotsLoader } from "@/components/loading";

export default function UrlDashboard() {
  const [urlInput, setUrlInput] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all URLs on mount
  useEffect(() => {
    fetchUrls();
  }, []);

  // Fetch all URLs for the logged-in user
  async function fetchUrls() {
    setLoading(true);
    try {
      const res = await fetch("/api/url/allurls", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch URLs");
      setUrls(data.urls || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }

  }

  async function deleteUrl(shortId) {
    try {
      const res = await fetch(`/api/url/allurls?shortId=${shortId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete URL");

      // remove deleted url from state
      setUrls((prev) => prev.filter((u) => u.shortId !== shortId));
    } catch (err) {
      setError(err.message);
    }
  }

  // Create a new short URL
  async function handleShorten() {
    if (!urlInput.trim()) {
      setError("URL cannot be empty");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/url", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to shorten URL");

      const newUrl = {
        shortId: data.shortId,
        originalUrl: data.redirectURL || urlInput,
        shortUrl: `/${data.shortId}`,
        analyticsUrl: `/api/url/${data.shortId}`,
        totalClicks: 0,
        visitHistory: [],
      };

      setUrls((prev) => [...prev, newUrl]);
      setUrlInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        URL Shortener Dashboard
      </h1>

      {/* URL Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-3xl">
        <input
          type="url"
          placeholder="Enter long URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleShorten}
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* URL Table */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Short ID</th>
              <th className="border px-4 py-2">Short URL</th>
              <th className="border px-4 py-2">Original URL</th>
              <th className="border px-4 py-2">Total Clicks</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((u) => (
              <tr key={u.shortId}>
                <td className="border px-4 py-2">{u.shortId}</td>
                <td className="border px-4 py-2">
                  <a
                    href={`/${u.shortId}`} // root-level
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    /{u.shortId}
                  </a>
                </td>
                <td className="border px-4 py-2">{u.redirectURL}</td>
                <td className="border px-4 py-2">
                  {u.visitHistory?.length || 0}
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white rounded-2xl px-2 py-1 font-bold"
                    onClick={() => deleteUrl(u.shortId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {urls.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No URLs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <DotsLoader/>}

      {/* <Spinner/> */}
    <BottomNavbar/>
    </div>
  );
}
