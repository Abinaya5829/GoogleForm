const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const Intern = require("./models/Intern");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads")); // ✅ to serve uploaded files

// ✅ Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ MongoDB connection
mongoose.connect(
  "mongodb+srv://abinayaa5829:EB2LuNH2iPIbSgcR@abinaya.tnlrrn7.mongodb.net/internshipDB?retryWrites=true&w=majority&appName=Abinaya",
  { }
)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB error:", err));

// ✅ POST Route with file upload
app.post("/submit", upload.single("resume"), async (req, res) => {
  try {
    const intern = new Intern({
      ...req.body,
      resumePath: req.file ? req.file.path : null,
      submittedAt: new Date()
    });
    await intern.save();
    res.status(200).send("✅ Form submitted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to submit form: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
