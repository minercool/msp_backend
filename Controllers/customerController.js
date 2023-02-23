const express = require("express");
const router = express.Router();
const Customer = require("../Models/customerModel");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const Quote = require("../Models/quoteModel");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const details = require("../details.json");
const customerModel = require("../Models/customerModel");

//find all
router.get("/", function (req, res) {
  Customer.find({})
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});


//find one
router.get("/:id", function (req, res) {
  Customer.findById(req.params.id, function (err, customer) {
    if (err) return res.status(500).send({ err });
    if (!customer) return res.status(404).send("No customer found.");
    res.status(200).send(customer);
  });
});

router.post("/add", (req, res) => {
  contactInfo = req.body.contact;
  adressInfo = req.body.adress;
  informationsInfo = req.body.informations;

  //creating contact data
  contact = { companyName: contactInfo.companyName };

  if (contactInfo.companyName == undefined) {
    return res.status(401).json({ Error: "Company Name is a required field!" });
  }
  if (contactInfo.email == undefined) {
    return res
      .status(401)
      .json({ Error: "Company email is a required field!" });
  }

  if (contactInfo.hasOwnProperty("email")) {
    if (!validator.isEmail(contactInfo.email)) {
      return res.status(401).json({ Error: "Invalid Email format!" });
    } else {
      contact.email = contactInfo.email;
    }
  }
  if (contactInfo.hasOwnProperty("phone")) {
    contact.phone = contactInfo.phone;
  }

  //creating adress data
  adress = { country: adressInfo.country };
  if (adressInfo.hasOwnProperty("addressLine1")) {
    adress.addressLine1 = adressInfo.addressLine1;
  }
  if (adressInfo.hasOwnProperty("addressLine2")) {
    adress.addressLine2 = adressInfo.addressLine2;
  }
  if (adressInfo.hasOwnProperty("city")) {
    adress.city = adressInfo.city;
  }
  if (adressInfo.hasOwnProperty("state")) {
    adress.state = adressInfo.state;
  }
  if (adressInfo.hasOwnProperty("zip")) {
    adress.zip = adressInfo.zip;
  }

  if (informationsInfo.hasOwnProperty("fullName")) {
    informations = {
      fullName: informationsInfo.fullName,
      createdBy: informationsInfo.createdBy,
    };
  }

  const customer = new Customer({
    Contacts: contact,
    Address: adress,
    Informations: informations,
  });

  customer
    .save()
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.put("/update/:id", (req, res) => {
  contactInfo = req.body.contact;
  adressInfo = req.body.adress;
  informationsInfo = req.body.informations;

  if (contactInfo.companyName == "") {
    return res.status(401).json({ Error: "Company Name is a required field!" });
  }
  contact = { companyName: contactInfo.companyName };

  if (contactInfo.hasOwnProperty("email")) {
    if (!validator.isEmail(contactInfo.email)) {
      return res.status(402).json({ Error: "Invalid Email format!" });
    } else {
      contact.email = contactInfo.email;
    }
  }
  if (contactInfo.hasOwnProperty("phone")) {
    contact.phone = contactInfo.phone;
  }

  //creating adress data
  adress = {
    country: adressInfo.country,
    addressLine1: adressInfo.addressLine1,
  };

  if (adressInfo.hasOwnProperty("addressLine1")) {
    adress.addressLine1 = adressInfo.addressLine1;
  }
  if (adressInfo.hasOwnProperty("addressLine2")) {
    adress.addressLine2 = adressInfo.addressLine2;
  }
  if (adressInfo.hasOwnProperty("city")) {
    adress.city = adressInfo.city;
  }
  if (adressInfo.hasOwnProperty("state")) {
    adress.state = adressInfo.state;
  }
  if (adressInfo.hasOwnProperty("zip")) {
    adress.zip = adressInfo.zip;
  }

  if (informationsInfo.hasOwnProperty("fullName")) {
    informations.fullName = informationsInfo.fullName;
  }

  const customer = new Customer({
    Contacts: contact,
    Address: adress,
    Informations: informationsInfo,
  });

  Customer.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        Contacts: customer.Contacts,
        Address: customer.Address,
        Informations: customer.Informations,
      },
    }
  )
    .then((data) => {
      return res.status(201).json({
        Result:
          data == null || data.modifiedCount == 0
            ? "Couldn't find this customer!"
            : "Update has been made!",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

//delete
router.delete("/:id", function (req, res) {

  Customer.findByIdAndDelete(req.params.id, function (err, customer) {
    if (err) return res.status(500).send("There was a problem deleting the customer.");
  Quote.find({"customer._id" : req.params.id})
      .then((data) => {
        for(let i= 0 ; i< data.length ; i++){
          Quote.findByIdAndDelete(data[i]._id, function (err, q) {

          })

        }
      })
    res.status(200).send(customer);
  });
});

router.post("/archive/:id", (req, res) => {
  (lastArchivedBy = req.body.lastArchivedBy),
    Customer.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          "Informations.status": "archived",
          "Informations.lastArchivedBy": lastArchivedBy,
          "Informations.lastArchivedDate": new Date(),
        },
      }
    )
      .then((data) => {
        return res.status(201).json({
          Result:
            data == null || data.modifiedCount == 0
              ? "Couldn't find a reseller with this Email!"
              : "Status has been change to archive!",
        });
      })
      .catch((error) => {
        return res.status(401).json(error);
      });
});

router.post("/afficher/:id", (req, res) => {
  Customer.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { "Informations.status": "active" } }
  )
    .then((data) => {
      return res.status(201).json({
        Result:
          data == null || data.modifiedCount == 0
            ? "Couldn't find a reseller with this Email!"
            : "Status has been change to active!",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/getByStatus/:status/:reseller", function (req, res) {
  Customer.find({ "Informations.status": req.params.status , "Informations.createdBy._id": req.params.reseller })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a customer with this Status!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/getByStatus/:status", function (req, res) {
  Customer.find({ "Informations.status": req.params.status })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a customer with this Status!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/getByReseller/:reseller", function (req, res) {
  Customer.find({ "Informations.createdBy._id": req.params.reseller })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a customer with this reseller!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.post("/lockCustomer", (req, res) => {
  
    Customer.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          "Informations.status": "blocked",
          
        },
      }
    )
      .then((data) => {
        return res.status(201).json({
          Result:
            data == null || data.modifiedCount == 0
              ? "Couldn't find a reseller with this id!"
              : "Status has been change to blocked!",
        });
      })
      .catch((error) => {
        return res.status(401).json(error);
      });
});

router.post("/sendmail", (req, res) => {
  
  let user = req.body;
  sendMail(user, info => {
    
    res.send(info);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.email,
      pass: details.password
    }
  });

  let mailOptions = {
    from: '"MSP FOR AFRICA"<msp.for.africa@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Customer Account status !! ⚠️", // Subject line
    html: `<h1>Hi ${user.customerName} your account now is blocked , for more details contact ${user.resEmail}  </h1><br>
    <h4>Thanks for joining MSP</h4>`
  };


  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
 
  callback(info);
}
router.post("/setStatus", (req, res) => {
  //Active , Blocked , OnHold
  
  newstatus = req.body.status;
  Customer
    .findOneAndUpdate(
      { _id: req.body.id },
      { $set: { "Informations.status": newstatus } }
    )
    .then((data) => {
      return res.status(201).json({
        Result:
          data == null || data.modifiedCount == 0
            ? "Couldn't find a reseller with this Email!"
            : "Status has been change!",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});


module.exports = router;
