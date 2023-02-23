const mongoose = require('mongoose')

const GeneratorCodeTemplate = new mongoose.Schema({
    Code:{
        type:String,
        required:true,
        unique : true
    }
    
})

module.exports = mongoose.model("GeneratorCode",GeneratorCodeTemplate)