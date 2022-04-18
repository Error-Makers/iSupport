"use strict";

const express = require("express");
const router = express.Router();
const database = require("../../../db/models/index");
const bcrypt = require("bcrypt");
const basicAuth = require("../../../middleware/auth/basicAuth");
const UserControll = require("../../../controllers/userControll");
const aclAuth = require("../../../middleware/auth/aclAuth");
const bearerAuth = require("../../../middleware/auth/bearerAuth");

// signin,signup
router.post("/signup", signupFunc);
router.post("/signin", basicAuth, signinFunc);

//logout
router.get("/user/logout/:id", bearerAuth, UserControll.userLogout);


// change  passworde
// router.post('/:id/change',[check('password').matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/).withMessage('must contain at least 8 char character')],UserControll.changePassword);

// function:
// signup Function
async function signupFunc(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 5);
    const record = await database.users.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(403).send("Error occurred");
  }
}

// signin Function
function signinFunc(req, res) {
  res.status(200).json(req.user);
}

module.exports = router;
