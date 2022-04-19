'use strict';
// const jwt = require("jsonwebtoken");
require("dotenv").config();
// const SECRET = process.env.SECRET;
const database = require("../../db/models/index");
const errorHandler = require("../../middleware/error-handlers/500");

const bearerAuth = async (req, res, next) => {
  try {
    if (req.headers["authorization"]) {
      let bearerHeaderParts = req.headers.authorization.split(" ");
      let token = bearerHeaderParts.pop();


      try {
        let user = await database.users.authenticateBearer(token);
        if(user){
          req.user =user;
          // req.user.token=token;
          next();
        }else{
          res.status(500).send('please login again ,invalid token');
        }
      } catch (error) {
        res.status(403).send(`Error from bearerAuth: ${error} `);

      }

      // const parsedToken = jwt.verify(token, SECRET);
      // const user = await User.findOne({
      //   where: { username: parsedToken.data },
      // });
      // const test = await User.findOne({
      //   where: { username: parsedToken.data },
      // });

      // if (test) {
      //   req.authorizedUser = user;
      //   next();
      // } else {
      //   res.status(500).send("please login again");
      // }
      
    } else {
      next(errorHandler);
    }
  } catch (e) {
    next("invalid Token");
  }
};
module.exports = bearerAuth;
