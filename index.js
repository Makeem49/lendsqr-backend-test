// dependency import 
const express = require('express');
const morgan = require("morgan")
const createError = require("http-errors")
require('dotenv').config()
const UserRoute = require('./src/routes/Users.route')
const AuthRoute = require('./src/routes/Auth.route')

// express instantiation 
const app = express();
// consoling to terminal in development 
app.use(morgan('dev'))


// middleware for converting json being to an object
app.use(express.json())

// middleware for converting the form body to object 
app.use(express.urlencoded({extended : true }))


PORT = process.env.PORT || 4000

app.get("/", (req, res, next) => {
    res.status(201)
})

app.use('/api/v1/auth', AuthRoute)
app.use('/api/v1/users', UserRoute)

// middleware for handling unspecified route 
app.use((req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error : {
            status : err.status || 500 ,
            message : err.message
        }
    })
})

module.exports = app 

