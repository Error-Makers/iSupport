"use strict";

const bcrypt = require("bcrypt");
const validationResult = require("express-validator");
const database = require("../db/models/index");

const db = require("../db/models/index");

// delete user
exports.DeleteUser = async (req, res, next) => {
  let uid = parseInt(req.params.id);
  try {
    let fetchedUser = await database.users.findOne({
      where: { id: uid },
      include: [database.communities, database.posts],
    });
    if (fetchedUser) {
      await database.users.destroy({ where: { id: uid } });

      res
        .status(201)
        .json({ fetchedUser: fetchedUser, message: "deleted successfully" });
    } else {
      res.status(500).json(`the user id ${uid} isn\'t exist`);
    }
  } catch (error) {
    res.status(500).json(`error: ${error} from delete user end point `);
  }
};

// update user data
exports.updateUser = async (req, res, next) => {
  let uid = parseInt(req.params.id);

  let fetchedUser = await database.users.findOne({ where: { id: uid } });
  req.body.password = await bcrypt.hash(req.body.password, 5);
  if (fetchedUser) {
    let userUpdated = await db.users.update(
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      },
      { where: { id: uid } }
    );

    if (userUpdated) {
      let fetchedUser = await database.users.findOne({ where: { id: uid } });
      res
        .status(200)
        .json({ message: "user have been Updeted", updateUser: fetchedUser });
    } else {
      res.status(500).json(` error: ${error} from update user`);
    }
  } else {
    res.status(500).json(`the user ${uid} isn\'t exist`);
  }
};

// To call all the user
exports.allUsers = async (req, res, next) => {
  await database.users
    .findAll({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

// when the session is end logout the user
exports.userLogout = (req, res, next) => {
  return res.redirect("/");
};
