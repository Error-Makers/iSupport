"use strict";
const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();
const aclAuth = require("../../middleware/auth/aclAuth");
const bearerAuth = require("../../middleware/auth/bearerAuth");

router.get("/community/:id", bearerAuth, aclAuth("read"), getCommunity);
router.post("/community", bearerAuth, aclAuth("create"), createCommunity);
router.delete("/community/:id", bearerAuth, aclAuth("read"), deleteCommunity);

async function createCommunity(req, res) {
  let user = await database.users.findByPk(req.user.id);
  if (user) {
    let createdData = await database.communities.create(req.body);
    if (createdData) {
      let check = await database.moderators.findOne({where :{user_id: req.user.id,community_id: createdData.id}});
      if (check) {
       
        res.status(200).json(`you are create  this community before`);
      }else{

        await database.moderators.create({
          user_id: req.user.id,
          community_id: createdData.id,
        });

        await database.users_communities.create({
          user_id: req.user.id,
          community_id: createdData.id
        } );
        
        let community = await database.communities.findOne({
          where: { id: createdData.id },
          include: {model :database.moderators,include :[database.users]},
        });
        res.status(200).json(`the community created`);
      }
    } else {
      res.status(500).send(`the community can not created`);
    }
  } else {
    res.status(500).send(`To do that you should register`);
  }
}

async function getCommunity(req, res) {
  let cid = req.params.id;
  let fetchCommunity = await database.communities.findOne({
    where: { id: cid },
    include:[ {model :database.users_communities ,include :[database.users]},
    {model :database.moderators ,include :[database.users]}]});
  if (fetchCommunity) {
    const users = fetchCommunity.dataValues.users_communities.map(element => element.user.username);
    res.status(200).json(users);
  } else {
    res.status(500).json(`the   community_id ${cid} isn\'t exist`);
  }
}

async function deleteCommunity(req, res) {
  let cid = req.params.id;
  let check = await database.moderators.findOne({where :{user_id: req.user.id,community_id: cid}});

  if (check) {
    let fetchCommunity = await database.communities.findOne({
    where: { id: cid },
    // include: [database.users, database, posts],
  });
  if (fetchCommunity) {
    await database.communities.destroy({ where: { id: cid } });
    res.status(201).json({
      // fetchCommunity: fetchCommunity,
      message: "deleted successfully"
    });
  } else {
    res.status(500).json(`The community id ${cid} isn't exist`);
  }
  }else{
    res.status(500).json(`you can't  delete  this community because you don't moderator`);
  }
  
}

module.exports = router;
