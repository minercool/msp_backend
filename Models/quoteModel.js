const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const ID = require("nodejs-unique-numeric-id-generator")

const quoteModel = new mongoose.Schema({
    number:{
        type:String,
    },
    distributor:{
        type:String,
        required:true
    },
    reseller: {
        type: Object,
      },
    subReseller:{
        type:String,
        
    },
    customer:{
        type: Object,
      },
    primary:{
        type : Boolean,
        default : false 
    },

    status :{
        type: String,
        default: "draft"
    },
    created: {
        type:Date,
        default:Date.now
    },
    opportunity : {
        type: String
    },
    quoteLine : [
        {
          quoteLine : {type : String} , 
          quantity : {type : Number},
          price : {type : Number},
          total : {type : Number},
          sku : {type : String},
          subId : {type : String },
          approvalCode : {type : String},


        }
    ]

})

quoteModel.plugin(uniqueValidator);
module.exports = mongoose.model("Quotes",quoteModel)