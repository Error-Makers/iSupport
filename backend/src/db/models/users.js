"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const API_SECRET = process.env.API_SECRET || "some secret word";

const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      // user_id: {
      //   primaryKey: true,
      //   autoIncrement: true,
      //   type: DataTypes.INTEGER,
      // },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("admin", "moderator", "user"),
        defaultValue: "user",
      },
      token: {
        type: DataTypes.VIRTUAL,
      },
      actions: {
        type: DataTypes.VIRTUAL,
        get() {
          const acl = {
            user: ["read", "create"],
            moderator: ["read", "create", "update", "delete"],
            admin: [
              "read",
              "create",
              "update",
              "delete",
              "delete all",
              "edit all",
            ],
          };
          return acl[this.role];
        },
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  Users.authenticateBasic = async function (username, password) {
    
    const user = await this.findOne({ where: { username } });//username:username
    // console.log(user);
    const valid = await bcrypt.compare(password, user.password);
    // console.log(valid);
    if (valid) {
      // generate a new token
      
      // let exp = Math.floor(Date.now() / 1000) + 600;// time to destroy token
      // let newToken = jwt.sign({exp:exp, username: user.username }, API_SECRET);
      
      let newToken = jwt.sign({ username: user.username }, API_SECRET);//delete this line after test
      user.token = newToken;
      return user;
    } else {
      throw new Error("Invalid User");
    }
  };


  Users.authenticateBearer = async function (token) {
    const parsedToken = jwt.verify(token, API_SECRET);
    const user = await this.findOne({
      where: { username: parsedToken.username },
    });
    if (user) {
      return user;
    } else {
      throw new Error("Invalid Token");
    }
  };
  return Users;
};
