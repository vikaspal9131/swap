const express = require("express");
const router = express.Router();
const SwapRequest = require("../models/SwapRequest");

router.post("/swap-request/:toUserId", async (req, res) => {
  const fromUser = req.session.user?._id;
  const toUser = req.params.toUserId;
  const { offeredSkill, wantedSkill, message } = req.body;

  if (!fromUser) return res.redirect("/login");
  if (fromUser === toUser) return res.redirect("back");

  const alreadySent = await SwapRequest.findOne({ fromUser, toUser });
  if (alreadySent) return res.redirect("back");

  await SwapRequest.create({
    fromUser,
    toUser,
    offeredSkill,
    wantedSkill,
    message
  });

  // Final: Redirect to home
  res.render("main");
});

module.exports = router;
