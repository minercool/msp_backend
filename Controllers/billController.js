let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  router = express.Router();

// Multer File upload settings
const DIR = './public/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  
});

// User model
let Bill = require('../Models/billModel');


// POST User
router.post('/create-bill', upload.single('file'), (req, res, next) => {

  const url = req.protocol + '://' + req.get('host')
  const bill = new Bill({
    invoiceId: req.body.invoiceId,
    resellerName: req.body.resellerName,
    paymentDate: req.body.paymentDate,
    file: url + '/public/' + req.file.filename
  });
  bill.save().then(result => {
    
    res.status(201).json({
      message: "User registered successfully!",
      billCreated: {
        _id: result._id,
        invoiceId: result.invoiceId,
        resellerName: result.resellerName,
        paymentDate: req.body.paymentDate,
        file: result.file
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })


})

// GET All User
router.get("/", (req, res, next) => {
  Bill.find().then(data => {
    res.status(200).json({
      message: "Users retrieved successfully!",
      bills: data
    });
  });
});

// GET User
router.get("/:id", (req, res, next) => {
  Bill.findById(req.params.id).then(data => {
    if (data) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "User not found!"
      });
    }
  });
});

router.delete("/:id", function (req, res) {
    Bill.findByIdAndDelete(req.params.id, function (err, p) {
      if (err)
        return res.status(500).send("There was a problem deleting the bill.");
      res.status(200).send(p);
    });
  });

  router.get("/getByReseller/:reseller", function (req, res) {
    Bill.find({ "resellerName": req.params.reseller })
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
