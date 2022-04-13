'use strict';
const base64 = require("base-64");
const bcrypt = require("bcrypt");
const database = require("../../db/models/index");
const errorHandler = require("../error-handlers/500");

async function basicAuth(req, res, next) {
  if (req.headers["authorization"]) {
    let basicHeaderParts = req.headers.authorization.split(" ");
    let encodedPart = basicHeaderParts.pop();
    let decoded = base64.decode(encodedPart);
    let [username, password] = decoded.split(":");
    const user = await database.users.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      req.validUsername = username;
      next();
    } else {
      next(errorHandler);
    }
  }
}

module.exports = basicAuth;
