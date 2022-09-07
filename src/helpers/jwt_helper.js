const JWT  = require('jsonwebtoken');
const createError = require('http-errors');

const signAccesToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            name : user.name
        }
        const secret = process.env.ACCESS_TOKEN
        const options = {
            expiresIn: '100s',
            issuer : 'www.Lendsqr.com',
            audience : user.id
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject (createError.InternalServerError())
            } else {
                resolve(token)
            }
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    // this is a middleware used to restrict an endpoint 
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized())
    } 
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(createError.Unauthorized(err.message))
            } else {
                return next(createError.Unauthorized(err.message))
            }
        }
        req.payload = payload
        next()
    })
}

const signRefreshToken =  (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            name : user.email
        }
        const secret = process.env.REFRESH_TOKEN
        const options = {
            expiresIn: '15 days',
            issuer : 'www.Lendsqr.com',
            audience : user.id
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject (createError.InternalServerError())
            } else {
                resolve(token)
            }
        })
    })
}

const verifyRefreshToken = (refreshtoken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, payload) => {
            if (err) reject(createError.Unauthorized())
            const userId = payload.aud
            resolve(userId)
            })
            .catch(error => {
                console.log(error)
                reject(createError.InternalServerError())
            })
        })
}

module.exports = {
    signAccesToken ,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
}