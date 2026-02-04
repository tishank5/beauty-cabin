const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const appointmentRoutes = require("./routes/appointment.routes");

dotenv.config();

const app = express();

/* 🔐 CORS (JWT Header Based) */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://my-project-psi-green-47.vercel.app",
      "https://www.beautycabin.suri",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);



app.use(express.json());

/* ✅ MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* 🩺 Health Check */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "✅ Backend is live" });
});

app.get("/db-check", (req, res) => {
  res.json({ ok: true, message: "Backend is live" });
});

/* 📌 Routes */
app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);

/* 🚀 Start Server (Render Compatible) */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
