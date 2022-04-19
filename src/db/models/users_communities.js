"use strict";

const UserCommunity = (db, DataTypes) =>
  db.define("users_communities", {
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
