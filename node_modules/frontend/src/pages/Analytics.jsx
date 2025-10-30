import React, { useEffect, useState } from "react";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p className="p-4 text-gray-500">Loading analytics...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Website Analytics</h1>

      {data.mostVisited ? (
        <div className="bg-blue-100 p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Most Visited Page</h2>
          <p>🔗 {data.mostVisited.page}</p>
          <p>👁️ {data.mostVisited.views} views</p>
          <p>⏱️ Avg Time: {data.mostVisited.avgTime}s</p>
        </div>
      ) : (
        <p>No data yet.</p>
      )}

      <h3 className="text-lg font-semibold">Top 5 Pages by Time Spent</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Page</th>
            <th className="border p-2">Views</th>
            <th className="border p-2">Avg Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {data.topPages.map((p, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{p.page}</td>
              <td className="border p-2">{p.views}</td>
              <td className="border p-2">{p.avgTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
