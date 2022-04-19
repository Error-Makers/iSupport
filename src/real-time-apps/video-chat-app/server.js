// const io = require("socket.io")(5555, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("CONNECTED");
//   socket.on("join-room", (roomId, userId) => {
//     socket.join(roomId);
//     // socket.to(roomId).broadcast.emit("user-connected", userId);

//     socket.on("disconnect", () => {
//       //   socket.to(roomId).broadcast.emit("user-disconnected", userId);
//     });
//   });
// });
