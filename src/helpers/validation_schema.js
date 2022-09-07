const joi = require("@hapi/joi")


const profileValidationSchema = joi.object({
    firstName : joi.string().required(),
    lastName : joi.string().required(),
    avatar : joi.string().required(),
    gender : joi.string().required(),
    bvn : joi.string().required().max(11),
    address : joi.string().required(),
    currency : joi.string().required()
})

const guarantorValidationSchema = joi.object({
    firstName : joi.string().required(),
    lastName : joi.string().required(),
    phoneNumber : joi.number().required(),
    gender : joi.string().required(),
    address : joi.string().required()
})

const socialValidationSchema = joi.object({
    facebook : joi.string(),
    twitter : joi.string(),
    linkedIn : joi.string(),
})

const incomeValidationSchema = joi.object({
    0 : joi.string().required(),
    1 : joi.string().required(),
    loanRepayment : joi.string().required()
})


const edcucationValidationSchema = joi.object({
    level : joi.string().required(),
    employmentStatus : joi.string().required(),
    duration : joi.string().required(),
    officeEmail : joi.string().email().required(),
    monthlyIncome : incomeValidationSchema
})


const UserValidationSchema = joi.object({
    createdAt : joi.date(),
    orgName : joi.string().required(),
    email : joi.string().email().required(),
    userName : joi.string().required(),
    phoneNumber : joi.number().required(),
    lastActiveDate : joi.date(),
    profile : profileValidationSchema,
    accountBalance : joi.number().required(),
    accountNumber : joi.number().required(),
    guarantor : guarantorValidationSchema,
    socials : socialValidationSchema,
    education : edcucationValidationSchema,
    password : joi.string().required()
})


const authSchema = joi.object({
    password : joi.string().min(2).max(15).required(),
    email : joi.string().email().required()
})


module.exports = {
    UserValidationSchema,
    authSchema
}