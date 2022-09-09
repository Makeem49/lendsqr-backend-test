const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")


const UserSchema = new Schema({
    createdAt : { type: Date, default: Date.now },
    orgName : {type : String, require : true},
    userName : {type : String, require : true, unique : true},
    email : {type : String, require : true , unique : true},
    phoneNumber : {type : Number, require : true, unique : true},
    lastActiveDate : {type: Date, default: Date.now},
    password : {type : String, require : true},
    profile : {
        firstName : {type : String, require : true},
        lastName : {type : String, require : true},
        avatar : {type : String, require : true},
        gender : {type : String, require : true},
        bvn : {type : Number, require : true, unique : true},
        address : {type : String, require : true},
        currency : {type : String, require : true},
    },
    accountBalance : {type : Number, require : true},
    accountNumber : {type : Number, require : true},
    guarantor : {
        firstName : {type : String, require : true},
        lastName : {type : String, require : true},
        address : {type : String, require : true},
        gender : {type : String, require : true},
        phoneNumber : {type : Number, require : true}
    },
    socials : {
        facebook : String,
        twitter : String,
        linkedIn : String,
    },
    education : {
        level : {type : String, require : true},
        employmentStatus : {type : String, require : true},
        duration : {type : String, require : true},
        officeEmail : {type : String, require : true},
        monthlyIncome : {
            "0" : String,
            "1" : String,
            "loanRepayment" : String
        }
    }
})


UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})


UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}


const User = mongoose.model('user', UserSchema)


module.exports = User 