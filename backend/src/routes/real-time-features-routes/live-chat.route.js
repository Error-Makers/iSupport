const express = require("express");
const router = express.Router();

// Logged in user home routes
router.get("/community/:id/live-chat", liveChatHandler);

//Get User Communities List
async function liveChatHandler(req, res) {
  let id = parseInt(req.params.id);
  res.render("index", { community_id: id });
}

module.exports = router;
