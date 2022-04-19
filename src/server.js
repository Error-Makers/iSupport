"use strict";

// Server Setup

const express = require("express");
const app = express();

// Routes & Dependencies
const database = require("./db/models/index");
const userRouter = require("../src/routes/user-routes/users");
const communityRouter = require("../src/routes/communities-routes/community.route");
const communitiesRouter = require("../src/routes/communities-routes/getAllCommunities.route");
const trendingCommunities = require("../src/routes/communities-routes/trendingCommunityRoute");
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
const http = require("http").Server(app);
const message = require("./real-time-apps/chat-app/message");
const {
  userJoin,
  getCurrentUser,
  leveCommunity,
  getUserCommunity,
} = require("./real-time-apps/chat-app/user");
require("./real-time-apps/video-chat-app/server");

// Middlewares
app.use(cors());
app.use(express.json());

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
app.use(trendingCommunities);
app.use(authRouter);
app.use(searchRouter);
app.use(communitiesListRouter);
app.use(liveChat);
app.use(videoChat);
app.use(personalProgress);

// socket.io

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// change this one to add the community name from the database
let chatBox = "community";
function getCurrentTime() {
  let chatDate = new Date();
  let hour = chatDate.getHours();
  let min = chatDate.getMinutes();
  let chatTime = hour + ":" + min + " ";
  return chatTime;
}
// when clinet get connect run
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("joinRoom", ({ username, communityID }) => {
    const user = userJoin(socket.id, username, communityID);
    socket.join(user.community_id);
    // to see the chat history
    // we need to create chat database
    async function getChatHistory() {
      let chatHistory = await database.chat
        .findAll({ where: { community_id: `${communityID}` } })
        .then((model) => {
          for (let item of model) {
            let chatDate = new Date(item.createdAt);
            let hour = chatDate.getHours();
            let min = chatDate.getMinutes();
            let chatTime = hour + ":" + min + " ";
            socket.emit(
              "message",
              message(
                item.dataValues.username + " ",
                chatTime,
                item.dataValues.chat_message
              )
            );
            console.log(
              item.dataValues.username + " ",
              chatTime,
              item.dataValues.chat_message
            );
          }
        });
    }
    getChatHistory();

    // welcome message
    socket.emit("message", message(" ", " ", "welcom to this community"));

    // user joind message
    let chatTime = getCurrentTime();
    socket.broadcast
      .to(user.community_id)
      .emit(
        "message",
        message(
          chatBox,
          chatTime,
          `${user.username} has joind this community chat`
        )
      );

    // send user and community data
    io.to(user.community_id).emit("userCommunity", {
      community_id: user.community_id,
      users: getUserCommunity(user.community_id),
    });
  });

  // listen to chat message
  socket.on("message", (msg) => {
    const user = getCurrentUser(socket.id);

    let chatTime = getCurrentTime();
    io.to(user.community_id).emit(
      "message",
      message(user.username, chatTime, msg)
    );
    console.log("user.username", user.community_id);
    database.chat.create({
      chat_message: msg,
      username: user.username,
      community_id: user.community_id,
    });
  });

  // when clinet disconnect
  socket.on("disconnect", () => {
    const user = leveCommunity(socket.id);
    let chatTime = getCurrentTime();
    if (user) {
      io.to(user.community_id).emit(
        "message",
        message(chatBox, chatTime, `${user.username} has left`)
      );

      // send users and community data
      io.to(user.community_id).emit("userCommunity", {
        community_id: user.community_id,
        users: getUserCommunity(user.community_id),
      });
    }
  });
});
// Error Handlers

app.use("*", notFoundHandler);
app.use(errorHandler);

// connect to sequelize & listen for requests
const start = (port) => {
  http.listen(port, () => console.log(`Running on Port ${port}`));
};

module.exports = {
  app: app,
  start: start,
  http: http,
};
