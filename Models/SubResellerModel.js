const mongoose = require('mongoose')

const subResellerTemplate = new mongoose.Schema({
    Email:{
        type:String,
        required:true,
        unique : true
    },
    Password:{
        type:String,
        required:true
    },
    SuperReseller : {
        type: Object
      }
    })

module.exports = mongoose.model("SubReseller",subResellerTemplate)