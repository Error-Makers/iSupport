"use strict";


const database = require("../../db/models/index");
const message = require("./message");
const {
  userJoin,
  getCurrentUser,
  leveCommunity,
  getUserCommunity,
} = require("./user");

const io = require("socket.io")(4444, {
  cors: {
    origin: "*",
  },
});
// const chatConnection = io.connect(`${host}/chat`);

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
    console.log("----------------------------------------++",user.community_id);

    // to see the chat history
    // we need to create chat database
    async function getChatHistory() {
      // {where:{community_id:communityID}}
      // add the where clause after popping the DB with some dummy data
      // let test =  await database.chat.findAll();
      // console.log("test1 -------------",test);
      // let test2 = await database.chat.findAll({where:{community_id:`${communityID}`}});
      // console.log("test2 -------------",test2);
      let chatHistory = await database.chat.findAll({where:{community_id:`${communityID}`}}).then((model) => {
        for (let item of model) {
          // console.log(item.chat_message);
          let chatDate = new Date(item.createdAt);
          let hour = chatDate.getHours();
          let min = chatDate.getMinutes();
          let chatTime = hour + ":" + min + " ";
          socket.emit(
            "message",
            message(item.dataValues.username + " ", chatTime, item.dataValues.chat_message)
          );
          console.log(item.dataValues.username + " ", chatTime, item.dataValues.chat_message)
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
