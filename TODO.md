# TODO: Exclude Analytics Page from Tracking and Most Visited Calculation

## Steps to Complete

- [x] Modify `frontend/src/utils/tracker.js` to skip initializing tracking if the current page is "/analytics"
- [x] Modify `frontend/src/App.jsx` to skip sending time spent data if the current page is "/analytics"
- [x] Modify `server/routes/events.js` in the `/api/analytics` endpoint to exclude "/analytics" from the stats calculation (skip counting views and time for that page)
- [ ] Test: Navigate to the analytics page and verify it doesn't appear in most visited, and check backend logs for no tracking events on "/analytics"
- [x] Test: Run the frontend and backend to ensure no errors
