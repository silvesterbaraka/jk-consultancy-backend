const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Schema matches your form fields
const formSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  country: String,
  state:   { type: String, required: true },
  city:    { type: String, required: true },
  address: String,
  gender:  String,
  message: String,
  date:    { type: Date, default: Date.now }
});

const FormSubmission = mongoose.model("FormSubmission", formSchema);

// Save form data
app.post("/api/form", async (req, res) => {
  try {
    const formData = new FormSubmission(req.body);
    await formData.save();
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

// View all submissions
app.get("/submissions", async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ date: -1 });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
