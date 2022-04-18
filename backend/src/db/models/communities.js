"use strict";

const Communities = (db, DataTypes) =>
  db.define("communities", {

    community_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    community_desc: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  
  });

module.exports = Communities;
