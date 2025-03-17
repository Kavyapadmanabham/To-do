const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
});

router.post("/", authMiddleware, async (req, res) => {
    const task = new Task({ user: req.user.id, title: req.body.title });
    await task.save();
    res.json(task);
});

router.put("/:id", authMiddleware, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task.user.toString() === req.user.id) {
        task.completed = req.body.completed;
        await task.save();
        res.json(task);
    } else {
        res.status(401).json({ message: "Not authorized" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

module.exports = router;
