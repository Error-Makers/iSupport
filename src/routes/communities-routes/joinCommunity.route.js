const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();
const bearerAuth = require("../../middleware/auth/bearerAuth");

// Logged in user home routes
router.get("/join-community/:id", bearerAuth, getCommunityLeaderboard);

//Get User Communities List
async function getCommunityLeaderboard(req, res) {
  let id = parseInt(req.params.id);
  let userId = req.user.dataValues.id;

  const newUserAndCommunity = await database.users_communities.create({
    user_id: userId,
    community_id: id,
  });
  res.status(200).json(newUserAndCommunity);
}

module.exports = router;
