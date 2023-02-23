const mongoose = require('mongoose');
const ID = require("nodejs-unique-numeric-id-generator");

const subscriptionModelSchema = new mongoose.Schema({

    sub : {
        type : String,
        required : true
    },

    status : {
        type : String,
        required : true
    },
    customer : {
        type : String,
        required : true
    },
    reseller : {
        type : Object,
    },
    product : {
        type : String,
        required : true
    },
    name : {
        type : String,
        default:"SUB-" + ID.generate(new Date().toJSON()),
    },

    quantity : {
        type : Number,
        required : true
    },
    approvalCode : {
        type : String,
    }
})

module.exports = mongoose.model('subscription' , subscriptionModelSchema )
