const createError = require("http-errors")
const { authSchema } = require("../helpers/validation_schema")
const User = require("../database/Users.model")
const { signAccesToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');


const LoginRoute = async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email : result.email})
        if (!user) throw createError.NotFound("User no registered.")
        const isMatch = await user.isValidPassword(result.password) 
        if (!isMatch) throw createError.Unauthorized()
        const accessToken = await signAccesToken(user);
        const refreshToken = await signRefreshToken(user);
        res.send({accessToken, refreshToken})
    } catch (error) {
        console.log(error)
        if (error.isJoi === true) {
            next(createError.BadRequest('Invalid username/password'))
        }
        next(error)
    }
}

const Logout = async (req, res, next) => {
    try {
        const {refreshToken} = req.body
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        if (userId) res.sendStatus(204)
        throw error
    } catch (error) {
        next(error)
    }
}

const RefreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body 
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        const saveUser = await User.findOne({id : userId})
        const newAccessToken = await signAccesToken(saveUser)
        const newRefreshToken = await signRefreshToken(saveUser);
        res.send({newAccessToken, newRefreshToken})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    LoginRoute,
    Logout,
    RefreshToken
}