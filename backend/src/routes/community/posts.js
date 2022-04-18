"use strict";
const express = require("express");
const database = require("../../db/models/index");
const router = express.Router();
const aclAuth = require("../../middleware/auth/aclAuth");
const bearerAuth = require("../../middleware/auth/bearerAuth");

// Posts Route
router.post("/posts", bearerAuth, aclAuth("read"), createPostHandler);
router.get("/posts", bearerAuth, aclAuth("delete all"), getPostsHandler);
router.get("/posts/:id", bearerAuth, aclAuth("read"), getSinglePostsHandler);
router.put("/posts/:id", bearerAuth, aclAuth("read"), updatePostInfoHandler);
router.delete("/posts/:id", bearerAuth, aclAuth("read"), deletePostHandler);
router.get(
  "/posts/author",
  bearerAuth,
  aclAuth("read"),
  getPostsFromUserHandler
);
router.get(
  "/posts/community/:id",
  bearerAuth,
  aclAuth("read"),
  getPostsFromCommunityHandler
);
router.get("/posts/", bearerAuth, aclAuth("read"), getUserPostsFromCommunity);

// Controllers

//Create new Post
async function createPostHandler(req, res) {
  let body = req.body;

  let user = await database.users.findByPk(body.author);
  if (user) {
    let createdPost = await database.posts.create(body);
    if (createdPost) {
      let post = await database.posts.findOne({
        where: { id: createdPost.id },
        include: [database.users, database.communities],
      });
      res.status(200).json(post);
    } else {
      res.status(500).send(`the   post can not created`);
    }
  } else {
    res.status(500).send(`To do that you should register`);
  }
}

//Get All Posts
async function getPostsHandler(req, res) {
  let fetchedPost = await database.posts.findAll({
    include: [database.users, database.communities],
  });
  res.status(200).json(fetchedPost);
}
//Get single Posts
async function getSinglePostsHandler(req, res) {
  let pid = parseInt(req.params.id);
  let fetchedPost = await database.posts.findOne({
    where: { id: pid },
    include: [database.users, database.communities],
  });
  if (fetchedPost) {
    res.status(200).json(fetchedPost);
  } else {
    res.status(500).send(`the  post id ${pid} isn\'t exist`);
  }
}
//Update single Posts
async function updatePostInfoHandler(req, res) {
  let pid = req.params.id;
  // console.log('req.user.id', req.user.id);

  let toUpdate = await database.posts.findOne({ where: { id: pid } });

  if (toUpdate) {
    if (toUpdate.author === req.user.id) {
      let updatedPost = await toUpdate.update(req.body);
      res.status(201).json(updatedPost);
    } else {
      res
        .status(204)
        .send(`You can't edite this post because you aren't the author `);
    }
  } else {
    res.status(500).send(`the  post id ${pid} isn\'t exist`);
  }
}
//Delete single Posts
async function deletePostHandler(req, res) {
  let pid = parseInt(req.params.id);

  let fetchedPost = await database.posts.findOne({ where: { id: pid } });
  if (fetchedPost) {
    if (fetchedPost.author === req.user.id) {
      await database.posts.destroy({ where: { id: pid } });
      res
        .status(201)
        .json({ fetchedPost: fetchedPost, message: "deleted successfully" });
    } else {
      res
        .status(204)
        .send(`You can't delete this post because you aren't the author `);
    }
  } else {
    res.status(500).send(`the  post id ${pid} isn\'t exist`);
  }
}

//Get All Posts from a single user from all communities
async function getPostsFromUserHandler(req, res) {
  // let uid = parseInt(req.params.id);

  let fetchedPosts = await database.posts.findAll({
    where: { author: req.user.id },
    include: [database.users, database.communities],
  });
  if (fetchedPosts) {
    res.status(200).json(fetchedPosts);
  } else {
    res.status(500).send(`you does't have any posts`);
  }
}

//Get All Posts from a single user from a single community
async function getUserPostsFromCommunity(req, res) {
  let uid = parseInt(req.body.author);
  let cid = parseInt(req.body.community_id);
  let fetchedPost = await database.posts.findAll({
    where: { author: uid, community_id: cid },
    include: [database.users, database.communities],
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
  let cid = parseInt(req.params.id);
  let fetchedPost = await database.posts.findAll({
    where: { community_id: cid },
    include: [database.users],
  });
  if (fetchedPost) {
    res.status(200).json(fetchedPost);
  } else {
    res.status(500).send(`the   community_id ${cid} isn\'t exist`);
  }
}

module.exports = router;
