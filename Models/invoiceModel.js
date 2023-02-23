const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const invoiceModel = new mongoose.Schema({
  number: {
    type: String,
  },
  reseller: {
    type: Object,
  },
  status: {
    type: String,
    default: "unpaid",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  amountTot: { type : Number , default : 0},
  quoteLine: [
    {
      quoteLine: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      total: { type: Number },
      sku: { type: String },
      approvalCode : {type : String},
      subId : {type : String },
      startdate: {type : String },
      enddate: {type : String}


    },
  ],
  etat :{ type : String , default : "hidden"},
  month :{ type : Number},
  year :{ type : Number},
});

invoiceModel.plugin(uniqueValidator);
module.exports = mongoose.model("Invoices", invoiceModel);
