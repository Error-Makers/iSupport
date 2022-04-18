const database = require("../../db/models/index");

const chatRoom = async (req, res, next) => {
  const { instrument } = require("@socket.io/admin-ui");
  const io = require("socket.io")(3000);
  const community_id = req.params.id;
  const communityName = await database.communities.findOne({
    where: { id: community_id },
  });

  const userIo = io.of(`/community/${id}/liveChat`);

  userIo.use((socket, next) => {
    //     if (socket.handshake.auth.token) {
    //       socket.username = getUsernameFromToken(socket.handshake.auth.token);
    //       next();
    //     } else {
    //       next(new Error("please send a token"));
    //     }
    //   });
    userIo.on("connection", (socket) => {
      socket.username = await database.users;
      console.log(`CONNECTED TO ${communityName} NAMESPACE`, socket.username);
    });

    //   function getUsernameFromToken(token) {
    //     return token;
    //   }

    io.on("connection", (socket) => {
      console.log("CONNECTED", socket.id);
      socket.on("send-message", (message, room) => {
        console.log(message);
        if (room === "") {
          // socket.broadcast.emit("pass-message", message);
          console.log("You can't send a message without joining a community");
        } else {
          socket.to(room).emit("pass-message", message);
        }
      });
      socket.on("join-room", (room, cb) => {
        socket.join(room);
        cb(`joined room: ${room}`);
      });

      socket.on("ping", (n) => console.log(n));
    });

    instrument(io, { auth: false });
  });
};

module.exports = chatRoom;
