"use strict";
const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();

router.get("/trending", trendingCommunity);

async function trendingCommunity(req, res) {
  let postsRaw = await database.posts.findAll({
    attributes: ["community_id"],
    group: "community_id",
    order: [database.sequelize.fn("COUNT", database.sequelize.col("posts"))],
    limit: 5,
  });
  let trendingCommunitiesID = postsRaw.map((ele) => ele["community_id"]);
  let communities = await database.communities.findAll();
  let returnedCommunitiesNames = communities
    .filter((ele) =>
      trendingCommunitiesID.indexOf(ele.dataValues.community_name)
    )
    .map((ele) => ele["community_name"]);
  res.status(201).json(returnedCommunitiesNames);
}

module.exports = router;
