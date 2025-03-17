const path = require("path");
require("dotenv").config(); // ✅ Load environment variables first
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("🔴 MongoDB connection error:", err));

// ✅ Task Schema
const taskSchema = new mongoose.Schema({
    name: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, 
});
const Task = mongoose.model("Task", taskSchema);

// ✅ Fetch tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// ✅ Add a task
app.post("/api/tasks", async (req, res) => {
    try {
        const newTask = new Task({ name: req.body.name });
        await newTask.save();
        res.status(201).json({ message: "✅ Task added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add task" });
    }
});

// ✅ Update task status
app.put("/api/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { completed: req.body.completed });
        res.json({ message: "✅ Task updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

// ✅ Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
/*app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`📌 Registered Route: ${Object.keys(middleware.route.methods).join(", ").toUpperCase()} ${middleware.route.path}`);
    }
});*/

app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

