const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Schema & Model
const formSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: String,
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: String,
  gender: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const FormSubmission = mongoose.model("FormSubmission", formSchema);

// ✅ Root route (for testing in browser)
app.get("/", (req, res) => {
  res.send("🚀 JK Consultancy Backend is running successfully!");
});

// API Route for form submission
app.post("/api/form", async (req, res) => {
  try {
    // Save form data to MongoDB
    const formData = new FormSubmission(req.body);
    await formData.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: "New JK Consultancy Form Submission",
      text: `
        Service Type: ${req.body.serviceType}
        Name: ${req.body.name}
        Email: ${req.body.email}
        Phone: ${req.body.phone}
        Country: ${req.body.country || "N/A"}
        State: ${req.body.state}
        City: ${req.body.city}
        Address: ${req.body.address || "N/A"}
        Gender: ${req.body.gender || "N/A"}
        Message: ${req.body.message || "N/A"}
      `
    });

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
