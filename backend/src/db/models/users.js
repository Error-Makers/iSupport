"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const API_SECRET = process.env.API_SECRET || "some secret word";

const { Model } = require("sequelize");
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
        type: DataTypes.ENUM("admin", "writer", "editor", "user"),
        defaultValue: "user",
      },
      token: {
        type: DataTypes.VIRTUAL,
      },
      actions: {
        type: DataTypes.VIRTUAL,
        get() {
          const acl = {
            user: ["read"],
            writer: ["read", "create"],
            editor: ["read", "create", "update"],
            admin: ["read", "create", "update", "delete"],
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
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      let newToken = jwt.sign({ username: user.username }, API_SECRET);
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