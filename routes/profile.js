const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const SwapRequest = require("../models/SwapRequest"); 


router.get("/profile", async (req, res) => {
 
  if (!req.session.user) {
    console.log("Access to /profile denied: User not logged in. Redirecting to /login.");
    return res.redirect("/login");
  }

  try {
    const userId = req.session.user._id;

   
    const user = await User.findById(userId);

    
    if (!user) {
      console.log("User not found in DB for ID:", userId, ". Destroying session and redirecting to /login.");
      req.session.destroy(err => {
        if (err) console.error("Error destroying session:", err);
        res.clearCookie("connect.sid");
        return res.redirect("/login");
      });
      return; 
    }

 
  
    const incomingRequests = await SwapRequest.find({ toUser: userId }).populate("fromUser");


    const outgoingRequests = await SwapRequest.find({ fromUser: userId }).populate("toUser");

    res.render("profile", {
      user, 
      incomingRequests, 
      outgoingRequests 
    });

  } catch (err) {
    console.error("Error fetching profile data:", err);
    res.status(500).send("Server Error: Could not load profile.");
  }
});

router.post('/profile/update', async (req, res) => {

    if (!req.session.user) {
        console.log("Profile update denied: User not logged in. Redirecting to /login.");
        return res.redirect('/login');
    }

    const userId = req.session.user._id;

    const { name, profilePhoto, skillsOffered, skillsWanted } = req.body;

    try {
    
        const skillsOfferedArray = skillsOffered ? skillsOffered.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
        const skillsWantedArray = skillsWanted ? skillsWanted.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: name,
                profilePhoto: profilePhoto,
                skillsOffered: skillsOfferedArray,
                skillsWanted: skillsWantedArray
            },
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
     
            console.error('User not found during profile update for ID:', userId);

            return res.redirect('/profile?error=UserNotFoundForUpdate');
        }

        req.session.user = updatedUser;

        console.log("Profile updated successfully for user:", updatedUser.name);

        res.redirect('/profile?success=ProfileUpdated');

    } catch (error) {
        console.error('Error updating profile:', error);

        res.redirect(`/profile?error=${encodeURIComponent(error.message || 'UnknownError')}`);
    }
});

module.exports = router;