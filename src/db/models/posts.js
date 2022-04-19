"use strict";

const Posts = (db, DataTypes) =>
  db.define("posts", {
    post_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

module.exports = Posts;
