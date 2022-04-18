"use strict";

const UserCommunity = (db, DataTypes) =>
  db.define("users_communities", {
    user_community_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

module.exports = UserCommunity;
