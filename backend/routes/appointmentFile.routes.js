const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();
const dbPath = path.join(__dirname, "../db.json");

// Initialize DB file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ appointments: [] }, null, 2));
}

// Helper function to read DB
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return { appointments: [] };
  }
};

// Helper function to write DB
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// CREATE appointment (customer)
router.post("/", async (req, res) => {
  try {
    const db = readDB();
    const newAppointment = {
      _id: Date.now().toString(),
      ...req.body,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    db.appointments.push(newAppointment);
    writeDB(db);
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ appointments (admin - protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = readDB();
    const sorted = db.appointments.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CONFIRM appointment
router.patch("/:id/confirm", authMiddleware, async (req, res) => {
  try {
    const db = readDB();
    const appointment = db.appointments.find(a => a._id === req.params.id);
    if (appointment) {
      appointment.status = "Confirmed";
      writeDB(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const db = readDB();
    db.appointments = db.appointments.filter(a => a._id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
