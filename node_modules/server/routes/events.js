import express from "express";
import { insertEvent, getRecentEvents } from "../db.js";

const router = express.Router();

/**
 * POST /api/events
 * Collects new tracking events
 */
router.post("/events", async (req, res) => {
  try {
    const { type, details, page, timestamp, referrer, user } = req.body;
    if (!type) return res.status(400).json({ error: "Missing event type" });

    const eventData = {
      details: details || {},
      page: page || null,
      referrer: referrer || null,
      timestamp: timestamp || new Date().toISOString(),
    };

    const id = await insertEvent(type, eventData, user || "anonymous");
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error collecting event:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/stats
 * Returns aggregated analytics summary
 */
router.get("/stats", async (req, res) => {
  try {
    const rows = await getRecentEvents(1000);

    const analytics = {
      total_events: rows.length,
      page_views: 0,
      clicks: 0,
      avg_time_on_page: 0,
      most_viewed_pages: {},
    };

    let totalDuration = 0;
    let timeEvents = 0;

    rows.forEach((r) => {
      let d = {};
      try {
        d = typeof r.data === "string" ? JSON.parse(r.data) : r.data;
      } catch {
        d = {};
      }

      if (r.type === "page_view") {
        analytics.page_views++;
        const url = d.url || r.page || "unknown";
        analytics.most_viewed_pages[url] =
          (analytics.most_viewed_pages[url] || 0) + 1;
      } else if (r.type === "click") {
        analytics.clicks++;
      } else if (r.type === "time_on_page") {
        totalDuration += d.duration || 0;
        timeEvents++;
      }
    });

    analytics.avg_time_on_page = timeEvents
      ? (totalDuration / timeEvents / 1000).toFixed(2)
      : 0;

    res.json(analytics);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/recent
 * Returns the most recent events
 */
router.get("/recent", async (req, res) => {
  try {
    const events = await getRecentEvents(10);
    res.json(events);
  } catch (err) {
    console.error("Error fetching recent events:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
