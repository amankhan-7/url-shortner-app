let isRefreshing = false;
let refreshPromise = null;
let accessToken = null; // store token if using header-based auth

export async function fetchWithAuth(url, options = {}) {
  // Ensure headers exist
  options.headers = options.headers || {};

  // Attach access token if available
  if (accessToken) {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    // If not unauthorized, return response immediately
    if (response.status !== 401) return response;

    // If already refreshing, wait for it
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const refreshRes = await fetch("/api/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!refreshRes.ok) throw new Error("Refresh failed");

          // Assume backend returns new access token
          const data = await refreshRes.json();
          accessToken = data.accessToken;

          return accessToken;
        } finally {
          isRefreshing = false;
        }
      })();
    }

    await refreshPromise;

    // Retry original request with updated token
    if (accessToken) {
      options.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const retryResponse = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (retryResponse.status === 401) {
      // Token refresh failed or session expired
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    return retryResponse;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}
