'use strict';
const express = require('express');
const database = require('../src/db/models/index');
const router = express.Router();
const { QueryTypes } = require('sequelize');

router.get("/trending/:id", getTrending);
router.get("/trending", trendingCommity);

async function trendingCommity(req,res){
    const [results, metadata] = await database.sequelize.query(
        `SELECT  count(posts)
        FROM posts
        GROUP BY community_id
        ORDER BY COUNT(posts) DESC
        LIMIT 5;`
      );
    console.log(results,'888888');
    let getTrendingCommunity = await database.communities.findAll();
    res.status(201).send(getTrendingCommunity);
    // res.send(req.body);
}

async function getTrending(req,res){
    let id = req.params.id;
    let allData = await database.communities.findOne({ where: { id: id } });
    res.status(200).send(allData);
    // res.send('test trending')
}



module.exports = router;
