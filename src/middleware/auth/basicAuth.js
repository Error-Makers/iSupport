"use strict";
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
    console.log(username ,password);
    try {
      let validUser = await  database.users.authenticateBasic(username,password); 
      // console.log(validUser);
      if (validUser) {
        req.user =validUser;
    
        next();
    }else{
        res.status(403).send('invalid dddddddddd');
    } 
    } catch (error) {
      res.status(403).send('invalid error from basic ');
    }


   }
}

module.exports = basicAuth;
