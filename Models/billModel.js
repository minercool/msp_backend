const mongoose = require('mongoose');

const billModelSchema = new mongoose.Schema({

    invoiceId : {
        type : String
    
    },


    resellerName : {
        type : String,
        
    },
    paymentDate : {
       type : String
      
        
    },
    file : {
        type : String,
        
    }
    
})

module.exports = mongoose.model('bill' , billModelSchema )