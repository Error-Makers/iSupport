const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();
const bearerAuth = require("../../middleware/auth/bearerAuth");
const aclAuth = require("../../middleware/auth/aclAuth");
const db = require("../../db/models/index");

// Logged in user home routes
router.post("/join-community/:id", bearerAuth,aclAuth('read') ,joinCommunity);

//Join User to Community
async function joinCommunity(req, res) {
  // console.log( ' req.user.dataValues.id',req.user.id );//req.user.id it's work and retun id key
  let id = parseInt(req.params.id);
  let userId = req.user.dataValues.id;

let findUser =await db.users_communities.findOne({where :{user_id :userId ,community_id:id}});

if (findUser) {
  res.status(200).json(`you are exist in this community`);
}else{
    const newUserAndCommunity = await database.users_communities.create({
    user_id: userId,
    community_id: id
  } );
  if (newUserAndCommunity) {
    // console.log(newUserAndCommunity);
    let user = await db.users_communities.findOne({where :{user_community_id :newUserAndCommunity.user_community_id},include :{model :db.users}});
    res.status(200).send(`you have joined the community`);
  }
}


}

module.exports = router;
