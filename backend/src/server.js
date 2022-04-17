"use strict";

// Server Setup

const express = require("express");
const app = express();

// Routes & Dependencies

const userRouter = require("../src/routes/user-routes/users");
const communityRouter = require("../src/routes/communities-routes/community.route");
const communitiesRouter = require("../src/routes/communities-routes/getAllCommunities.route");

const postsRouter = require("../src/routes/community/posts");
const authRouter = require("../src/routes/user-routes/auth-routes/auth.routes");
const searchRouter = require("../src/routes/communities-routes/searchRoute");
const communitiesListRouter = require("../src/routes/communities-routes/communitiesList.route");
const liveChat = require("./routes/real-time-features-routes/live-chat.route");
const videoChat = require("./routes/real-time-features-routes/video-chat.route");
const leaderboardRoute = require("./routes/community/leaderborad");
const personalProgress = require("./routes/community/personalProgress");
const joinCommunity = require("./routes/communities-routes/joinCommunity.route");
const notFoundHandler = require("./middleware/error-handlers/404");
const errorHandler = require("./middleware/error-handlers/500");
const cors = require("cors");
require("./real-time-apps/chat-app/server");
require("./real-time-apps/video-chat-app/server");

// Middlewares
app.use(cors());
app.use(express.json());

// connect to sequelize & listen for requests
const start = (port) => {
  app.listen(port, () => console.log(`Running on Port ${port}`));
};

//  Static Files
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname));

// Routers

app.get("/", (req, res) => {
  res.status(200).send("server is up and running");
});
app.use(userRouter);
app.use(communityRouter);
app.use(communitiesRouter);
app.use(joinCommunity);
app.use(postsRouter);
app.use(leaderboardRoute);
app.use(authRouter);
app.use(searchRouter);
app.use(communitiesListRouter);
app.use(liveChat);
app.use(videoChat);
app.use(personalProgress);

// Error Handlers

app.use("*", notFoundHandler);
app.use(errorHandler);

module.exports = {
  app: app,
  start: start,
};
