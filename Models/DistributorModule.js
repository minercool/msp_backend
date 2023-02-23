const mongoose = require('mongoose')

const distrubutorTemplate = new mongoose.Schema({
    Email:{
        type:String,
        required:true,
        unique : true
    },
    Clients:[{ type: mongoose.Schema.Types.ObjectId, ref: "reseller" }]
})

module.exports = mongoose.model("Distrubutor",distrubutorTemplate)