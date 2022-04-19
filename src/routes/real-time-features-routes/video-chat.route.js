const express = require("express");
const router = express.Router();

router.get("/community/:id/video-chat", liveChatHandler);

async function liveChatHandler(req, res) {
  let id = parseInt(req.params.id);
  res.render("video", { roomId: id });
}

module.exports = router;
