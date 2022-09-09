const express = require("express");
const createError = require("http-errors")
const { authSchema } = require("../helpers/validation_schema")
const User = require("../database/Users.model")
const { signAccesToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');
const {LoginRoute,Logout,RefreshToken} = require("../controllers/Auth.controller")

const route = express.Router()

route.post('/login', LoginRoute)

route.get('/logout', Logout)

route.get('/refresh-token', RefreshToken)

module.exports = route 