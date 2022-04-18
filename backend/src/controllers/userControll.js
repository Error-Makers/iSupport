'use strict';


const bcrypt = require('bcrypt');
const validationResult = require('express-validator');
const database = require('../db/models/index');

const db = require('../db/models/index');

// delete user
exports.DeleteUser = async (req, res, next) => {
    let uid = parseInt(req.params.id);
    try {
        let fetchedUser = await database.users.findOne({ where: { id: uid }, include: [database.communities, database.posts] });
        if (fetchedUser) {
            await database.users.destroy({ where: { id: uid } });

            res.status(201).json({ fetchedUser: fetchedUser, message: 'deleted successfully' });
        } else {
            res.status(500).json(`the user id ${uid} isn\'t exist`);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json(`error: ${error} from delete user end point `);
    }


}

// update user data
exports.updateUser = async (req, res, next) => {
    let uid = parseInt(req.params.id);

    let fetchedUser = await database.users.findOne({ where: { id: uid } });
    req.body.password = await bcrypt.hash(req.body.password, 5);
    // console.log(fetchedUser);
    if (fetchedUser) {
        let userUpdated = await db.users.update({ username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email,password :req.body.password },{where :{id :uid}});

        console.log('userUpdated',userUpdated);
        if (userUpdated) {
            let fetchedUser = await database.users.findOne({ where: { id: uid } });
            res.status(200).json({ message: 'user have been Updeted', updateUser: fetchedUser });
            // console.log(error);

        } else {
            res.status(500).json(` error: ${error} from update user`);

        }

    } else {
        res.status(500).json(`the user ${uid} isn\'t exist`);
    }
}
// // change the password
// exports.changePassword = (req, res, next) => {
//     const error = validationResult(req);

//     if (!error.isEmpty()) {
//         console.log(error.array());
//         return res.status(422).json({ error: error.array() });
//     }
//     else {
//         database.users.update({ password: req.body.password }).exec()
//             .then(bcrypt.hash(req.body.password, 5, (err, hash) => {
//                 if (err) {
//                     return res.status(500).json({ err })
//                 }
//                 else {
//                     database.users.findById(req.params.id, (err, user) => {
//                         if (err) {
//                             return next(err);
//                         }
//                         user.password = hash
//                         user.save()
//                     }).then(() => {
//                         res.status(201).json({ message: 'password have been changed' });

//                     }).catch(error => {
//                         console.log(error);
//                         res.status(500).json({ error: error })
//                     })

//                 }
//             }))
//     }
// }

// To call all the user
exports.allUsers = async (req, res, next) => {
    await database.users.findAll({}).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        console.log(error);
        res.status(500).json({ error: error })

    })

}

// when the session is end logout the user
exports.userLogout = (req, res, next) => {
    // console.log('******');
    // console.log(req);

    return res.redirect('/');

}