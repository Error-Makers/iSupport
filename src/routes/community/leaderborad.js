const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();

// Logged in user home routes
router.get("/community/:id/leaderboard", getCommunityLeaderboard);

//Get User Communities List
async function getCommunityLeaderboard(req, res) {
  let id = parseInt(req.params.id);
  const leaderBoardResults = await database.posts.findAll({
    attributes: ["author"],
    group: ["author"],
    order: [database.sequelize.fn("COUNT", database.sequelize.col("author"))],
    limit: 5,
    where: { community_id: id },
  });
  console.log(leaderBoardResults);
  res.status(200).json(leaderBoardResults);
}

module.exports = router;
