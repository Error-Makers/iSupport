"use strict";
const express = require("express");
const database = require("../../db/models/index");
const bearerAuth = require("../../middleware/auth/bearerAuth");
const router = express.Router();

// Logged in user home routes
router.get("/community/:id/personalProgress", bearerAuth, getpersonalProgress);

//Get User Communities List
async function getpersonalProgress(req, res) {
  let id = parseInt(req.params.id);
  let userid = req.user.dataValues.id;
  const personalProgress = await database.posts.findAll({
    // attributes: ["author"],
    // group: "author",
    where: { community_id: id, author: userid },
  });
  res.status(200).json(personalProgress.length);
}

module.exports = router;
