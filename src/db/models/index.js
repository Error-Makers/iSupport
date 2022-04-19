"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const users = require("./users");
const basename = path.basename(__filename);
const POSTGRES_URI =
  process.env.NODE_ENV === "test" ? "sqlite:memory:" : process.env.DATABASE_URL;

let sequelizeOptions =
  process.env.NODE_ENV === "production"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};
const db = {};

let sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.users.belongsToMany(db.communities, {
  through: db.users_communities,
  foreignKey: "user_id",
});
db.communities.belongsToMany(db.users, {
  through: db.users_communities,
  foreignKey: "community_id",
});


db.users.hasMany(db.posts, { foreignKey: "author" });
db.posts.belongsTo(db.users, { foreignKey: "author" });

db.users.hasMany(db.moderators, { foreignKey: "user_id" });
db.moderators.belongsTo(db.users, { foreignKey: "user_id" });

db.communities.hasMany(db.posts, { foreignKey: "community_id" });
db.posts.belongsTo(db.communities, { foreignKey: "community_id" });

db.communities.hasMany(db.moderators, { foreginKey: "community_id" });
db.moderators.belongsTo(db.communities, { foreignKey: "community_id" });

db.users_communities.hasMany(db.communities, { foreginKey: "community_id" });
db.communities.belongsTo(db.users_communities, { foreignKey: "community_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
