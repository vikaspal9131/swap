const express = require("express");
const router = express.Router();
const SwapRequest = require("../models/SwapRequest");

router.post("/swap-request/:toUserId", async (req, res) => {
  const fromUser = req.session.user?._id;
  const toUser = req.params.toUserId;
  const { offeredSkill, wantedSkill, message } = req.body; 

  if (!fromUser) {
    return res.redirect("/login");
  }

  if (fromUser.toString() === toUser.toString()) { 

    return res.redirect("/");
  }

  try {
    const alreadySent = await SwapRequest.findOne({ fromUser, toUser });
    if (alreadySent) {
      return res.redirect("/");
    }

    await SwapRequest.create({
      fromUser,
      toUser,
      offeredSkill,
      wantedSkill,
      message
    });
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

module.exports = router;