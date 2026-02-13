let isRefreshing = false;
let refreshPromise = null;

export async function fetchWithAuth(url, options = {}) {
  try {
    let response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (response.status !== 401) return response;

    // If already refreshing, wait for it
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = fetch("/api/refresh", {
        method: "POST",
        credentials: "include",
      }).finally(() => {
        isRefreshing = false;
      });
    }

    const refreshRes = await refreshPromise;

    if (!refreshRes.ok) {
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    // Retry original request
    return await fetch(url, {
      ...options,
      credentials: "include",
    });

  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}
