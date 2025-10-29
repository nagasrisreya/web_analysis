import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { initTracker } from "./utils/tracker";

// --- Dummy Pages ---
function Home() {
  return (
    <div>
      <h2>🏠 Home Page</h2>
      <p>Welcome to our demo analytics site. Click around to generate data!</p>
      <button onClick={() => alert("Home button clicked!")}>Click Me</button>
    </div>
  );
}

function Products() {
  return (
    <div>
      <h2>🛍️ Products Page</h2>
      <p>Click buttons here to simulate interactions!</p>
      <button onClick={() => alert("Product added to cart!")}>Add to Cart</button>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>ℹ️ About Page</h2>
      <p>This page helps test navigation and analytics tracking.</p>
    </div>
  );
}

// --- Main App ---
function App() {
  const [stats, setStats] = useState({});
  const [type, setType] = useState("");
  const [data, setData] = useState("");

  // Initialize tracker once
  useEffect(() => {
    initTracker();
  }, []);

  // Fetch stats periodically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/stats");
        const d = await res.json();
        setStats(d);
      } catch (e) {
        console.error("Error fetching stats:", e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Manual event send
  const sendEvent = async () => {
    if (!type.trim()) return alert("Please enter an event type!");
    await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, details: { data } }),
    });
    setType("");
    setData("");
  };

  return (
    <Router>
      <div style={{ padding: "2rem", fontFamily: "monospace" }}>
        <h1>📊 Big Data Web Analytics Dashboard</h1>

        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/products">Products</Link> |{" "}
          <Link to="/about">About</Link>
        </nav>

        <div style={{ marginBottom: "1.5rem" }}>
          <input
            placeholder="Event Type (e.g. custom_event)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            placeholder="Data (optional)"
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={sendEvent}>Send Event</button>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
        </Routes>

        {stats && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Web Analytics Summary</h2>
            <p>📈 Total Events: {stats.total_events}</p>
            <p>👁️ Page Views: {stats.page_views}</p>
            <p>🖱️ Clicks: {stats.clicks}</p>
            <p>⏱️ Avg Time on Page: {stats.avg_time_on_page}s</p>

            <h3>Most Viewed Pages</h3>
            <ul>
              {stats.most_viewed_pages &&
                Object.entries(stats.most_viewed_pages).map(([url, count]) => (
                  <li key={url}>
                    {url}: {count}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
