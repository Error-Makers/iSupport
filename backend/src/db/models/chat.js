"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // define association here
    }
  }
  Chat.init(
    {
      chat_message: DataTypes.STRING,
      username: DataTypes.STRING,
      community_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "chat",
    }
  );
  return Chat;
};
