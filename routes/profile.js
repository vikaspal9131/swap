const express = require("express");
const router = express.Router();
const User = require("../models/user");
const SwapRequest = require("../models/SwapRequest");

router.get("/profile", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    const incomingRequests = await SwapRequest.find({ toUser: userId }).populate("fromUser");
    const outgoingRequests = await SwapRequest.find({ fromUser: userId }).populate("toUser");

    res.render("profile", {
      user,
      incomingRequests,
      outgoingRequests
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

