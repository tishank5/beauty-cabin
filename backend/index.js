const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const appointmentRoutes = require("./routes/appointmentFile.routes");

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

/* ✅ File-Based Database (No MongoDB needed!) */
console.log("✅ Using File-Based Database");
console.log("📁 Appointments stored in: db.json");

/* 🩺 Health Check */
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
