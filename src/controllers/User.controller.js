const createError = require('http-errors');
const { default: mongoose } = require('mongoose');
const { UserValidationSchema } = require("../helpers/validation_schema")
const User = require('../database/Users.model')


const getAllUsers = async (req, res, next) => {
    console.log(req.query.expand)

    User.find({}, {__v : 0})
    .then(users => {
        if (req.query.expand) {
            res.send(users).status(200)
            return ;
        }
        const usersRoute = users.map(data => {
            return `http://${req.hostname}${process.env.PORT}${req.baseUrl}/${data._id}`
        })
        res.status(200).send(usersRoute)
        return;
    }).catch(error => {
        next(createError.InternalServerError())
    })
} 


const getOneUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId, {__v : 0})
        if (!user) throw createError.NotFound()
        res.status(200).send(user)
    } catch (error) {
        next(createError.NotFound())
    }
}

const createUser = async (req, res, next) => {
    try {
        const body = req.body  // destructuring the email from the body request 
        const result = await UserValidationSchema.validateAsync(req.body) // validating user input using joi async validator 

        const isUserExist = await User.findOne({email : result.email, phoneNumber : result.phoneNumber, bvn : result.profile.bvn, userName : result.userName})

        if (isUserExist) throw createError.Conflict(`Email ${result.email}/${result.profile.bvn}/${result.phoneNumber} already exist.`)

        const user = new User(body)
        const data = await user.save()
        console.log(req.body)
        res.status(201).send({"status" : "Ok", message : "User created"})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id 
        const userUpdate = req.body 
        const user = await User.findByIdAndUpdate(userId, userUpdate)
        if (!user) throw (createError.NotFound())
        res.send(user)
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid user id.'))
        }
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id 
        const user = await User.findByIdAndDelete(userId)
        if (!user) throw createError(404, 'User does not exist.')
        res.send(user)
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid user id.'))
        }
        next(error)
    }
}

module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
}