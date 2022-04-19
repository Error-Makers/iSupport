const server = require("./src/server");
require("dotenv").config();
const database = require("./src/db/models/index");

database.sequelize.sync().then(() => {
  server.start(process.env.PORT || 5050);
});
