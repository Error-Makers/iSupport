"use strict";

const express = require("express");
const router = express.Router();
//???
const database = require('../db/models/index');

const bcrypt = require('bcrypt');
const basicAuth = require('../middleware/auth/basicAuth');
const UserControll = require('../controllers/userControll')
const check = require('check');

// Routes:
// signin,signup
router.post('/signup', signupFunc);
router.post('/signin', basicAuth, signinFunc);
//logout
router.get('/:id/logout',UserControll.userLogout);

// delete user
router.delete('/:id',acl('read'),UserControll.DeleteUser);

// update user data
router.put('/:id',UserControll.updateUser);

// change  passworde
router.post('/:id/change',[check('password').matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/).withMessage('must contain at least 8 char character')],UserControll.changePassword)

// function:
// signup Function
async function signupFunc(request, response) {
    try {
        request.body.password = await bcrypt.hash(request.body.password, 5);
        const record = await database.Users.create(request.body);
        response.status(201).json(record);
    } catch (error) {
        response.status(403).send("Error occurred");
    }
}

// signin Function
function signinFunc(request, response) {
    response.status(200).json(request.db.Users);
}

module.exports = router;
