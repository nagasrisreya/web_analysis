import express from "express";
import cors from "cors";
import morgan from "morgan";
import eventRoutes from "./routes/events.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("✅ Web Analytics Collector API is running!");
});

app.use("/api", eventRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening at http://localhost:${PORT}`));
