import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { initTracker } from "./utils/tracker";

// Auto-detect backend API base
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------------- Page Time Tracker Hook ---------------- */
function usePageTimer() {
  const location = useLocation();
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const prevPage = sessionStorage.getItem("currentPage");
    const now = Date.now();
    const duration = (now - startTime) / 1000; // seconds

    // send duration for previous page
    if (prevPage && duration > 0.5) {
      fetch(`${API_BASE}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: prevPage, duration }),
      }).catch((e) => console.error("Error sending duration:", e));
    }

    // update session for current page
    sessionStorage.setItem("currentPage", location.pathname);
    setStartTime(now);
  }, [location]);
}

/* ---------------- Dummy Pages ---------------- */
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

/* ---------------- Analytics Page ---------------- */
function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE}/analytics`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const json = await res.json();
        setData(json);
        setError("");
      } catch (e) {
        console.error("Error fetching analytics:", e);
        setError("Failed to connect to backend. Make sure the server is running.");
      }
    };

    fetchAnalytics();
    const i = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(i);
  }, []);

  if (error) return <p style={{ color: "tomato" }}>{error}</p>;
  if (!data) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2>📊 Website Analytics Summary</h2>
      <p>📁 Total Pages Tracked: {data.totalPages}</p>

      {data.mostVisited ? (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#181818",
            color: "#eee",
            borderRadius: "10px",
          }}
        >
          <h3>🏆 Most Visited Page</h3>
          <p>🔗 {data.mostVisited.page}</p>
          <p>👁️ Views: {data.mostVisited.views}</p>
          <p>⏱️ Avg Time: {data.mostVisited.avgTime}s</p>
        </div>
      ) : (
        <p>No analytics data yet.</p>
      )}

      <h3 style={{ marginTop: "1.5rem" }}>Top 5 Pages by Time Spent</h3>
      <table
        border="1"
        cellPadding="6"
        style={{
          borderCollapse: "collapse",
          background: "#202020",
          color: "#ddd",
        }}
      >
        <thead style={{ background: "#111" }}>
          <tr>
            <th>Page</th>
            <th>Views</th>
            <th>Avg Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {data.topPages.map((p, i) => (
            <tr key={i}>
              <td>{p.page}</td>
              <td>{p.views}</td>
              <td>{p.avgTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Wrapper that uses Router Context ---------------- */
function PageTrackerWrapper() {
  usePageTimer(); // now safely inside Router context
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

/* ---------------- Main App ---------------- */
function App() {
  const [type, setType] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    initTracker();
    sessionStorage.setItem("currentPage", window.location.pathname);
  }, []);

  const sendEvent = async () => {
    if (!type.trim()) return alert("Please enter an event type!");
    try {
      await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          details: { data },
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          referrer: document.referrer || null,
        }),
      });
      setType("");
      setData("");
    } catch (err) {
      alert("Failed to send event — check backend connection!");
      console.error(err);
    }
  };

  return (
    <Router>
      <div style={{ padding: "2rem", fontFamily: "monospace", color: "#fff" }}>
        <h1>📈 Big Data Web Analytics Demo</h1>

        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/products">Products</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          <Link to="/analytics">Analytics</Link>
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

        <PageTrackerWrapper />
      </div>
    </Router>
  );
}

export default App;
