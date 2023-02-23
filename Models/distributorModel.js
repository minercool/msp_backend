const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const signTemplate = new mongoose.Schema({
    Firstname:{
        type:String,
        required:true,
    },
    Lastname:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique : true
    },
    Password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

signTemplate.plugin(uniqueValidator);
module.exports = mongoose.model("Users",signTemplate)