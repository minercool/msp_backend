const express = require("express");
const router = express.Router();
const Invoice = require("../Models/invoiceModel");
const CC = require("currency-converter-lt");
const ID = require("nodejs-unique-numeric-id-generator");

router.get("/", function (req, res) {
  Invoice.find({})
    .then((data) => {
      
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});


router.post("/convert", function (req, res) {
  try{
  amountToConvert = req.body.amountToConvert;
  let fromCurrency = "EUR"; // US Dollars
  let toCurrency = "TND"; // Indian Ruppee
  let currencyConverter = new CC({
    from: fromCurrency,
    to: toCurrency,
    amount: amountToConvert,
  });


  currencyConverter.convert().then((response) => {
    console.log(
      amountToConvert +
        " " +
        fromCurrency +
        " is equal to " +
        response +
        " " +
        toCurrency
    );
    return res.status(201).json(response);
  }).catch(error =>{
    console.log("convert limit over ")
});
}catch(error){
  console.log(error)
}
});


//find one
router.get("/:id", function (req, res) {
  Invoice.findById(req.params.id, function (err, invoice) {
    if (err) return res.status(500).send({ err });
    if (!invoice) return res.status(404).send("No invoice found.");

    res.status(200).send(invoice);
  });
});


router
  .get("/getByReseller/:reseller", function (req, res) {
    Invoice.find({
      "reseller._id": req.params.reseller,
    }).then((result) => {
      return res.status(201).json(result);
    });
  })
  router.post("/changeStatus", (req, res) => {
    id = req.body.id;
    newstatus = req.body.status;
    Invoice.findByIdAndUpdate({ _id: id }, { $set: { status: newstatus } })
      .then((data) => {
        return res.status(201).json({
          Result:
            data == null || data.modifiedCount == 0
              ? "Couldn't find a invoice with this id!"
              : "Status has been change!",
        });
      })
      .catch((error) => {
        return res.status(401).json(error);
      });
  });



router.post("/create/:id", (req, res) => {
  reseller = req.body.reseller;
  quoteLine = req.body.quoteLine;
  

  date = new Date();
  console.log(date.getMonth() + 1);
  const invoice = new Invoice({
    reseller: reseller,
    quoteLine: quoteLine,
    number : "B-" + ID.generate(new Date().toJSON()),

  });

  Invoice.find({
    "reseller._id": req.params.id,
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }).then((data) => {
    if (data[0] != undefined) {
      
      data[0].quoteLine = data[0].quoteLine.concat(quoteLine);
      let total = 0;
      for (let i = 0; i < data[0].quoteLine.length; i++) {
        total = total + data[0].quoteLine[i].total;
      }
      data[0].amountTot = total;
      data[0].save();
      return res.status(201).json(data);
    } else {
      invoice.save()
        .then((datas) => {
          let total = 0;
          for (let i = 0; i < datas.quoteLine.length; i++) {
            total = total + datas.quoteLine[i].total;
          }
          datas.amountTot = total;
          datas.month = datas.created.getMonth() + 1;
          datas.year = datas.created.getFullYear();
          datas.save();
          return res.status(201).json(datas);
        })
        .catch((error) => {
          return res.status(401).json(error);
        });
    }
  });
});

router.put("/update/:id", (req, res) => {
  tot = req.body.amountTot;
  quoteLine = req.body.quoteLine;
  let total = 0;
  for (let i = 0; i < quoteLine.length; i++) {
    total = total + quoteLine[i].total;
  }
  tot = total;

  Invoice.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        quoteLine: req.body.quoteLine,
        amountTot: tot,
        etat: "displayed",
      },
    }
  )
    .then((data) => {
      return res.status(201).json({
        Result:
          data == null || data.modifiedCount == 0
            ? "Couldn't find this invoice!"
            : "Update has been made!",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.post("/removequoteline", (req, res) => {
  
  id = req.body._id;
  index = req.body.quotelineId;
  newTot= req.body.newTot;
  Invoice
    .findOneAndUpdate(
      { "_id": id , "quoteLine._id": index},
      { $set : { "quoteLine.$": null , "amountTot": newTot}}
    )
    
    .then((data) => {
      
      return res.status(201).json({data
        
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
    
});

router.post("/confirmeremovequoteline", (req, res) => {
  
  id = req.body._id;
  
  Invoice
      .findOneAndUpdate(
        { "_id": id },
        { $pull : { "quoteLine": null }}
      )
    
    .then((data) => {
      
      return res.status(201).json({data
        
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
    
});

router.get("/getbynumber/:number", function (req, res) {
  Invoice.findOne({ "number": req.params.number })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find " });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});


module.exports = router;
