const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const ContactInfoSchema = mongoose.Schema({
    companyName: {
        type:String,
        required:true,
        unique : true,
    },
    email: {
        type:String,
        unique : true,
    },
    phone: {
        type:String,
    },
    customerCode: {
        type:String,
    }
});


const AddressSchema = mongoose.Schema({
    addressLine1: {
        type:String,
    },
    addressLine2: {
        type:String,
    },
    city: {
        type:String,
    },
    state: {
        type:String,
    },
    zip: {
        type:String,
    },
    country: {
        type:Object,
    }
  });


  const InformationsSchema = mongoose.Schema({
    fullName: {
        type:String,
    },
    status: {
        type:String,
        default:"active"
    },
    created: {
        type:Date,
        default:Date.now
    },
    createdBy :Object,
    lastUpdateBy :{ type : Object },
    lastArchivedBy : {type: Object },
    lastArchivedDate : {type: Date },


  });


const customerTemplate = new mongoose.Schema({
    Contacts:ContactInfoSchema,
    Address:AddressSchema,
    Informations:InformationsSchema
})

customerTemplate.plugin(uniqueValidator);
module.exports = mongoose.model("Customer",customerTemplate)