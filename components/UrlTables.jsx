import { useEffect, useState } from "react";

const UrlTables = ({ urlId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!urlId) return;

    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/url/${urlId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch analytics");
        }

        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchAnalytics();
  }, [urlId]);

  if (!urlId) return null;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!analytics) return <p>Loading...</p>;

  return (
    <div className="mt-6">
      <p className="font-semibold">
        Short ID: <span className="text-indigo-500">{urlId}</span>
      </p>
      <p>Total Clicks: {analytics.totalClicks}</p>

      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {JSON.stringify(analytics.analytics, null, 2)}
      </pre>
    </div>
  );
};

export default UrlTables;
