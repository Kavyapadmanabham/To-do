const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } else {
        res.status(400).json({ message: "Invalid credentials" });
    }
});

module.exports = router;
