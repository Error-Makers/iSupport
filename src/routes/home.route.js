'use strict';
const express = require('express');
const router = express.Router();
const userControll = require('../controllers/userControll')

router.get('/',userControll.allUsers);

module.exports = router;

