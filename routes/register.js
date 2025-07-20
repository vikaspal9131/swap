const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Show Register Form
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

// Handle Register Form
router.post("/register", async (req, res) => {
  const { name, email, password, skillsOffered, skillsWanted } = req.body;

  try {
    const existing = await User.findOne({ $or: [{ email }, { name }] });
    if (existing) {
      const msg = existing.email === email ? "Email already exists" : "Username already taken";
      return res.render("auth/register", { error: msg });
    }

    const user = new User({
      name,
      email,
      password,
      skillsOffered: skillsOffered.split(",").map(s => s.trim()),
      skillsWanted: skillsWanted.split(",").map(s => s.trim())
    });

    await user.save();
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("auth/register", { error: "Registration failed. Try again." });
  }
});

module.exports = router;
