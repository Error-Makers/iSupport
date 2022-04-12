const express = require("express");
const database = require("../db/models/index");
const router = express.Router();

// Logged in user home routes
router.get("/community/:community_id/leaderboard", getCommunityLeaderboard);

//Get User Communities List
async function getCommunityLeaderboard(req, res) {
  let id = parseInt(req.params.id);
  // const [leaderBoardResults, metadata] = await database.sequelize.query(
  //   `SELECT  author FROM posts GROUP BY community_id ORDER BY COUNT(posts.author) DESC  LIMIT 5;`
  // );
  const leaderBoardResults = await database.posts.findAll({
    attributes: ["author"],
    group: "community_id",
    order: [database.sequelize.fn("COUNT", database.sequelize.col("author"))],
    limit: 5,
    where: { community_id: 1 },
  });
  console.log(leaderBoardResults);
  res.status(200).json(leaderBoardResults);
}

module.exports = router;