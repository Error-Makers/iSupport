const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();

// Logged in user home routes
router.get("/user/:id/communities", getUserCommunitiesList);

//Get User Communities List
async function getUserCommunitiesList(req, res) {
  console.log("#### WORKING #####");
  let id = parseInt(req.params.id);
  let fetchedUserCommunities = await database.users_communities.findAll({
    where: { user_id: id },
    include: [database.communities],
  });

  if (fetchedUserCommunities) {
    res.status(200).json(fetchedUserCommunities);
  } else {
    res.status(500).json(`the   community_id ${cid} isn\'t exist`);
  }
}

module.exports = router;
