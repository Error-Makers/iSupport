"use strict";
const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();
const aclAuth = require("../../middleware/auth/aclAuth");
const bearerAuth = require("../../middleware/auth/bearerAuth");

// Posts Route
router.post("/posts/community/:cid", bearerAuth, aclAuth("read"), createPostHandler);
router.get("/posts", bearerAuth, aclAuth("read"), getPostsHandler);
router.get("/posts/:id", bearerAuth, aclAuth("read"), getSinglePostsHandler);
router.put("/posts/:id", bearerAuth, aclAuth("read"), updatePostInfoHandler);
router.delete("/posts/:id", bearerAuth, aclAuth("read"), deletePostHandler);

router.get(
  "/posts/community/:cid",
  bearerAuth,
  aclAuth("read"),
  getPostsFromCommunityHandler
);
router.get("/posts/user/:cid", bearerAuth, aclAuth("read"), getUserPostsFromCommunity);

// Controllers

//Create new Post
async function createPostHandler(req, res) {
  let cid = parseInt(req.params.cid);
  let body = req.body;

  // let user = await database.users.findByPk(req.user.id);
  let community = await database.communities.findByPk(cid);
  // console.log(user);
  if (community) {
    // console.log(createdPost);
    let user_community = await database.users_communities.findOne({
      where: {
        user_id: req.user.id, community_id: community.id
      }
    });
    if (user_community) {
      let createdPost = await database.posts.create(body);
      await database.posts_communities_users.create({ post_id: createdPost.id, user_community_id: user_community.user_community_id });

      let post = await database.posts.findOne({
        where: { id: createdPost.id },
        include: { model: database.users_communities, include: [database.users] },
      });
      res.status(200).json(post);
    } else {
      res.status(500).send(`the post can not created you should join to this community to post :)`);
    }
  } else {
    res.status(500).send(`The id ${cid} of community  isn't exist `);
    // res.status(500).send(`To do that you should register`);
  }
}

//Get All Posts
async function getPostsHandler(req, res) {
  let fetchedPost = await database.posts.findAll({
    include: [{ model: database.users_communities, include: [database.users] }, { model: database.users_communities, include: [database.communities] }]
  });
  res.status(200).json(fetchedPost);
}
//Get single Posts
async function getSinglePostsHandler(req, res) {
  let pid = parseInt(req.params.id);
  let fetchedPost = await database.posts.findOne({
    where: { id: pid },
    include: [{ model: database.users_communities, include: [database.users] }, { model: database.users_communities, include: [database.communities] }]
  });
  if (fetchedPost) {
    res.status(200).json(fetchedPost);
  } else {
    res.status(500).send(`the  post id ${pid} isn\'t exist`);
  }
}
//Update single Posts
async function updatePostInfoHandler(req, res) {
  let pid = parseInt(req.params.id);
  // console.log('req.user.id', req.user.id);

  let toUpdate = await database.posts.findOne({
    where: { id: pid },
    include: [{ model: database.users_communities, include: [database.users] }, { model: database.users_communities, include: [database.communities] }]
  });

  if (toUpdate) {
    let author = toUpdate.users_communities[0].user.id;
    if (author === req.user.id) {
      let updatedPost = await toUpdate.update(req.body);
      res.status(201).json(updatedPost);
    } else {
      res.status(204).json(`You can't edite this post because you aren't the author `);
    }
  } else {
    res.status(500).send(`the  post id ${pid} isn\'t exist`);
  }
}
//Delete single Posts
async function deletePostHandler(req, res) {
  let pid = parseInt(req.params.id);

  let fetchedPost = await database.posts.findOne({
    where: { id: pid },
    include: [{ model: database.users_communities, include: [database.users] }, { model: database.users_communities, include: [database.communities] }]
  });
  if (fetchedPost) {

    let author = fetchedPost.users_communities[0].user.id;
    //console.log("authorauthorauthorauthor",author);
    //console.log("req.user.id",req.user.id);
    if (author === req.user.id) {
      await database.posts.destroy({ where: { id: pid } });
      res.status(201).json({ fetchedPost: fetchedPost, message: "deleted successfully" });
    } else {
      res.status(204).json(`You can't delete this post because you aren't the author `);
    }
  } else {
    res.status(500).send(`the  post id ${pid} isn\'t exist`);
  }
}

//Get All Posts from a single user from all communities

//Get All Posts from a single user from a single community
async function getUserPostsFromCommunity(req, res) {

  let cid = parseInt(req.params.cid);
  let fetchedPost = await database.users.findAll({
    where: { id: req.user.id },
    include: { model: database.users_communities, include: { model: database.posts_communities_users, include: [database.posts] } },
  });
  if (fetchedPost) {
    res.status(200).json(fetchedPost);
  } else {
    res
      .status(500)
      .send(`the  author_id ${uid} or community_id ${cid} aren\'t exist`);
  }
}

//Get All Posts from a single community
async function getPostsFromCommunityHandler(req, res) {
  let cid = parseInt(req.params.cid);
  let fetchedPost = await database.communities.findAll({
    where: { id: cid },
    include: { model: database.users_communities, include: [{ model: database.posts_communities_users, include: [database.posts] }, { model: database.users }] },
  });
  if (fetchedPost) {
    res.status(200).json(fetchedPost);
  } else {
    res.status(500).send(`the   community_id ${cid} isn\'t exist`);
  }
}

module.exports = router;
