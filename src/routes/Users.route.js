// grouping a common endpoint in a single router 

const express = require('express');
const UserRoute = require('../controllers/User.controller')
const {verifyAccessToken} = require("../helpers/jwt_helper")
const router = express.Router();

router.get('/', UserRoute.getAllUsers) // this is an open route 

router.get('/:id', verifyAccessToken, UserRoute.getOneUser) // user must have accesstoken before accessing this endpoint 

router.post('/', UserRoute.createUser)  // create a user, this is n open route 

router.patch('/:id', verifyAccessToken, UserRoute.updateUser) // user must have accesstoken before accessing this endpoint 

router.delete('/:id', verifyAccessToken, UserRoute.deleteUser) // user must have accesstoken before accessing this endpoint 


module.exports = router 