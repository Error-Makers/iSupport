const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();

// Logged in user home routes
router.get("/user/:id/communities", getUserCommunitiesList);

//Get User Communities List
async function getUserCommunitiesList(req, res) {
  let id = parseInt(req.params.id);
  let fetchedUserCommunities = await database.users_communities.findAll({
    where: { user_id: id },
    include: [database.communities],
  });
  let UserCommunitiesID = fetchedUserCommunities.map(
    (ele) => ele["community_id"]
  );
  let communities = await database.communities.findAll();
  let returnedCommunitiesNames = communities
    .filter((ele) => UserCommunitiesID.indexOf(ele.dataValues.community_name))
    .map((ele) => ele["community_name"]);
  if (returnedCommunitiesNames) {
    res.status(200).json(returnedCommunitiesNames);
  } else {
    res.status(500).json(`the   community_id ${id} isn\'t exist`);
  }
}

module.exports = router;
