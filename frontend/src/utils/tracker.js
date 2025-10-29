const API_URL = "http://localhost:3000/api/events";

/**
 * Send an event to backend
 */
async function sendEvent(type, details = {}) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        details,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer || null,
      }),
    });
  } catch (err) {
    console.error("Tracking failed:", err);
  }
}

/**
 * Initialize automatic tracking for page views, clicks, and time on page
 */
export const initTracker = () => {
  // --- Log page view ---
  sendEvent("page_view", {
    url: window.location.pathname,
    referrer: document.referrer,
  });

  // --- Log all button or link clicks ---
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, a");
    if (target) {
      sendEvent("click", {
        tag: target.tagName,
        text: target.innerText?.trim(),
        href: target.href || null,
      });
    }
  });

  // --- Log time spent before leaving ---
  const start = Date.now();
  window.addEventListener("beforeunload", () => {
    const duration = Date.now() - start;
    sendEvent("time_on_page", { duration });
  });
};

/**
 * Manual event trigger
 */
export async function trackEvent(type, details = {}) {
  await sendEvent(type, details);
}
