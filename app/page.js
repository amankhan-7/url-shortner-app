"use client";

import { useState, useEffect } from "react";
import BottomNavbar from "@/components/navbar";
import { DotsLoader } from "@/components/loading";
import { fetchWithAuth } from "@/backend/lib/refereshToken";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

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
    setError("");

    try {
      const res = await fetchWithAuth("/api/url/allurls");

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch URLs");

      setUrls(data.urls || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUrl(shortId) {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/url/allurls?shortId=${shortId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete URL");

      // remove deleted url from state
      setUrls((prev) => prev.filter((u) => u.shortId !== shortId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      const res = await fetchWithAuth("/api/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to shorten URL");

      const newUrl = {
        shortId: data.shortId,
        redirectURL: urlInput,
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

  const handleCopy = async (id) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${id}`);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pt-12">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        URL Shortener Dashboard
      </h1>

      {/* URL Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-3xl">
        <input
          type="url"
          placeholder="Enter long URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow duration-200 hover:shadow-md"
        />
        <button
          onClick={handleShorten}
          disabled={loading}
          className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors duration-200"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* URL Table */}
      {!loading && (
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              {/* Header */}
              <thead className="bg-indigo-500 text-white text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3">Short ID</th>
                  <th className="px-6 py-3">Short URL</th>
                  <th className="px-6 py-3">Original URL</th>
                  <th className="px-6 py-3 text-center">Clicks</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {urls.map((u) => (
                  <tr
                    key={u.shortId}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Short ID */}
                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                      <span>{u.shortId}</span>
                      <button
                        onClick={() => handleCopy(u.shortId)}
                        className="hover:text-indigo-600 cursor-pointer transition-colors"
                        title="Copy URL"
                      >
                        <Copy size={16} />
                      </button>
                    </td>

                    {/* Short URL */}
                    <td className="px-6 py-4">
                      <a
                        href={`/${u.shortId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setTimeout(fetchUrls, 500)}
                        className="text-indigo-600 font-medium hover:underline transition-colors"
                      >
                        /{u.shortId}
                      </a>
                    </td>

                    {/* Original URL */}
                    <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                      {u.redirectURL}
                    </td>

                    {/* Clicks */}
                    <td className="px-6 py-4 text-center font-semibold text-gray-700">
                      {u.visitHistory?.length || 0}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteUrl(u.shortId)}
                        className="px-4 py-1.5 text-xs font-semibold text-red-600 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {urls.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-gray-400 text-sm"
                    >
                      No URLs created yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && <DotsLoader />}

      {/* <Spinner/> */}
      <BottomNavbar />
    </div>
  );
}
