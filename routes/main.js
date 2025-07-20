const express = require("express");
const router = express.Router();
const User = require("../models/user");

// GET /
router.get("/", async (req, res) => {
  try {
    const users = await User.find().limit(12);
    res.render("main", {
      users,
      query: "",
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.render("main", {
      users: [],
      query: "",
      user: req.session.user
    });
  }
});

// POST /search
router.post("/search", async (req, res) => {
  const query = req.body.query?.trim() || "";

  const users = await User.find({
    $or: [
      { skillsOffered: { $regex: query, $options: "i" } },
      { skillsWanted: { $regex: query, $options: "i" } }
    ]
  });

  res.render("main", {
    users,
    query,
    user: req.session.user
  });
});

module.exports = router;
