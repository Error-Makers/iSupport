"use strict";

const express = require("express");
const database = require("../../db/models/index"); //just fix the path
const router = express.Router();
const bcrypt = require("bcrypt");
const aclAuth = require("../../middleware/auth/aclAuth");
const bearerAuth = require("../../middleware/auth/bearerAuth");
// Users Route
router.post("/users",bearerAuth,aclAuth('delete all') ,postUsersHandler);
router.get("/users",bearerAuth,aclAuth('delete all') , getUsersHandler);
router.get("/users/:id",bearerAuth,aclAuth('delete all') , getSingleUsersHandler);
router.put("/users/:id",bearerAuth,aclAuth('delete all') , updateUserInfoHandler);
router.delete("/users/:id",bearerAuth,aclAuth('delete all') , deleteUserHandler);

// Controllers

//Get All Users
async function postUsersHandler(req, res) {
  let body = req.body;
  req.body.password = await bcrypt.hash(req.body.password, 5);
  let user = await database.users.create(body);
  if (user) {
    let getUser = await database.users.findByPk(user.id);
    if (getUser) {
      res.status(200).json(getUser);
    } else {
      res.status(500).send("error from get user");
    }
  } else {
    res.status(500).send("error from user");
  }
}

//Get All Users
async function getUsersHandler(req, res) {
  let users = await database.users.findAll({ include: [database.communities] });

  res.status(200).json(users);
}

//Get single Users
async function getSingleUsersHandler(req, res) {
  let uid = parseInt(req.params.id);
  console.log(uid);

  let user = await database.users.findOne({
    where: { id: uid },
    include: [{model :database.communities} ,{model :database.users_communities ,include:[{model:database.posts_communities_users ,include :database.posts}]}],
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(500).send(`the user_id ${uid} isn't exist`);
  }
}

//Update single Users
async function updateUserInfoHandler(req, res) {
  let uid = req.params.id;
  let toUpdate = await database.users.findOne({ where: { id: uid } });
  if (toUpdate) {
    let updatedUser = await toUpdate.update(req.body);
    res.status(201).json(updatedUser);
  } else {
    res.status(500).send(`the  user_id ${uid} isn\'t exist`);
  }
}

//Delete single Users
async function deleteUserHandler(req, res) {
  let uid = parseInt(req.params.id);
  let fetchedUser = await database.users.findOne({
    where: { id: uid },
    include: [database.communities, database.posts],
  });
  await database.users.destroy({ where: { id: uid } });
  res
    .status(201)
    .json({ fetchedUser: fetchedUser, message: "deleted successfully" });
}

module.exports = router;
