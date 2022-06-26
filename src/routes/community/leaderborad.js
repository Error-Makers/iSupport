const express = require('express');
const database = require('../../db/models/index');
const router = express.Router();

//Get Community Leaderboard by Community ID
router.get('/community/:id/leaderboard', getCommunityLeaderboard);

async function getCommunityLeaderboard(req, res) {
  let id = parseInt(req.params.id);
  const result = await database.posts.findAll({
    attributes: [
      'author',
      database.sequelize.fn('COUNT', database.sequelize.col('author')),
    ],
    group: ['author'],
    order: [database.sequelize.fn('COUNT', database.sequelize.col('author'))],
    limit: 5,
    where: { community_id: id },
  });
  let leaderBoardResults = result.map(async (ele) => {
    let meta = await database.users.findOne({
      where: { id: ele.author },
    });
    let output = {
      user_id: meta.dataValues.id,
      username: meta.dataValues.username,
      firstname: meta.dataValues.firstName,
      lastname: ele.lastName,
      email: meta.dataValues.email,
    };
    return output;
  });
  res.status(200).json(result);
}

module.exports = router;
