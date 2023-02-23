const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');




const ContactInfoSchema = mongoose.Schema({
    CompanyName: {
        type:String,
        required:true,
        unique : true,
    },
    Email: {
        type:String,
        unique : true,
    },
    Phone: {
        type:String,
    },
    Logo: {
        type:String,
        default : "avatar.png"
    }
});


const AddressSchema = mongoose.Schema({
    AddressLine1: {
        type:String,
    },
    AddressLine2: {
        type:String,
    },
    City: {
        type:String,
    },
    State: {
        type:String,
    },
    Zip: {
        type:String,
    },
    Country: {
        type:Object,
        required:true
    }
  });


  const InformationsSchema = mongoose.Schema({
    FullName: {
        type:String,
    },
    Email: {
        type:String,
        required:true
    },
    Password: {
        type:String,
        required:true
    },
    Status: {
        type:String,
        default:"OnHold"
    },
    Created: {
        type:Date,
        default:Date.now
    },
    LastLogin:{
        type:Date,
        default:Date.now
    },
    resetToken: String,
    resetTokenExpiration: Date,
    creditLimit : {
        type:Number,
        default : 500
    },
    creditUser : {
        type:Number,
        default : 0
    },

  });


const resellerTemplate = new mongoose.Schema({
    Contacts:ContactInfoSchema,
    Address:AddressSchema,
    Informations:InformationsSchema
})

resellerTemplate.plugin(uniqueValidator);
module.exports = mongoose.model("Reseller",resellerTemplate)