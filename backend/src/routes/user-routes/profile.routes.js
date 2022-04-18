"use strict";
const express = require("express");
const router = express.Router();
const db = require("../../db/models/users");
const basicAuth = require("../../middleware/auth/basicAuth");

// profile page
router.get("/profile", basicAuth(db.Users), async (req, res) => {
  res.send(req.db.Users);
});

// update the profile
router.patch("/profile", basicAuth(db.Users), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email"];
  const isValid = updates.every((update) => allowUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send("error: Invalid Updates");
  }
  try {
    updates.forEach((update) => (req.db.Users[update] = req.body[update]));
    await req.db.Users.save();
    //    i'm not sure if it req.user or req.db.Users
    res.send(req.db.Users);
  } catch (error) {
    res.status(400).send("error", error);
  }
});

module.exports = router;
