const express = require("express");
const router = express.Router();
const database = require("../../db/models/index");

// Logged in user home routes
router.get("/community/:id/live-chat", liveChatHandler);

//Get User Communities List
async function liveChatHandler(req, res) {
  let id = parseInt(req.params.id);
  const dbQuery = await database.communities.findAll({
    where: { community_id: id },
  });
  let communityName = dbQuery[0].dataValues.community_name;
  res.render("index", { community_id: id, communityName });
}

module.exports = router;
