"use strict";
const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();
const aclAuth = require("../../middleware/auth/aclAuth");
const bearerAuth = require("../../middleware/auth/bearerAuth");

router.get("/communities", bearerAuth, aclAuth("read"), getAllCommunities);

async function getAllCommunities(req, res) {
  let allData = await database.communities.findAll({
    include: [database.users, database.posts],
  });
  if (allData) {
    res.status(200).json(allData);
  } else {
    res.status(500).json(`the   community_id ${cid} isn\'t exist`);
  }
}

module.exports = router;
