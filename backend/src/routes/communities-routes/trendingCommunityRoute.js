"use strict";
const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();

router.get("/trending", trendingCommunity);

async function trendingCommunity(req, res) {
  let postsRaw = await database.posts_communities_users.findAll({
    attributes: ["user_community_id" ],
    group: ["user_community_id"],
    order: [database.sequelize.fn("COUNT", database.sequelize.col("post_id"))],
    limit: 5,
    
  });
  console.log(postsRaw);
  let trendingCommunitiesID = postsRaw.map((ele) => ele["user_community_id"]);
  console.log(trendingCommunitiesID);
  let communities = await database.communities.findAll();
  let returnedCommunitiesNames = communities
    .filter((ele) =>
      trendingCommunitiesID.indexOf(ele.dataValues.community_name)
    )
    .map((ele) => ele["community_name"]);
  res.status(201).json(returnedCommunitiesNames);
}

module.exports = router;
