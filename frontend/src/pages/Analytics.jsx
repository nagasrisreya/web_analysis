import React, { useEffect, useState } from "react";
import AnalyticsCard from "../components/AnalyticsCard";
import AnalyticsTable from "../components/AnalyticsTable";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // Function to get display name for pages
  const getDisplayName = (page) => {
    const mapping = {
      "/": "Home",
      "/products": "Products",
      "/about": "About"
    };
    return mapping[page] || page;
  };

  // Function to format seconds into hr:min:sec
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Server returned an error");
        const json = await res.json();
        console.log("✅ Analytics data:", json);
        setData(json);
      } catch (err) {
        console.error("❌ Error fetching analytics:", err);
        setError("⚠️ Failed to load analytics. Check backend connection.");
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error)
    return <p className="p-4 text-red-500 font-semibold text-center">{error}</p>;
  if (!data)
    return (
      <p className="p-4 text-gray-500 text-center">Loading analytics...</p>
    );

  // The backend returns { totalPages, mostVisited, topPages }
  // topPages is an array of {page, views, avgTime}
  const topPages = data?.topPages || [];
  const totalVisits = topPages.reduce((sum, p) => sum + (p.views || 0), 0);
  const mostVisited = data?.mostVisited || { page: "N/A", views: 0, avgTime: "0" };
  const mostVisitedPage = getDisplayName(mostVisited.page);
  const mostVisitedCount = mostVisited.views;
  const avgTimeOnMostVisited = mostVisited.avgTime;

  // For the table, use topPages with display names
  const pageVisits = Object.fromEntries(
    topPages.map(p => [
      getDisplayName(p.page),
      { count: p.views, totalTime: parseFloat(p.avgTime) * p.views }
    ])
  );
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg space-y-8">
        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          📈 Website Analytics Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AnalyticsCard
            title="Total Visits"
            value={totalVisits}
            color="bg-blue-600/30 border border-blue-400"
          />
          <AnalyticsCard
            title="Most Visited Page"
            value={mostVisitedPage || "N/A"}
            color="bg-green-600/30 border border-green-400"
          />
          <AnalyticsCard
            title="Avg Time on Most Visited"
            value={formatTime(parseFloat(avgTimeOnMostVisited))}
            color="bg-purple-600/30 border border-purple-400"
          />
        </div>

        {/* Detailed Table */}
        <AnalyticsTable pageVisits={pageVisits || {}} />
      </div>
    </div>
  );
}
