const express = require("express");
const router = express.Router();
const resellerModule = require("../Models/resellerModel");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var uuid = require("uuid");
const nodemailer = require("nodemailer");
const details = require("../details.json");
const subResellerModule = require("../Models/SubResellerModel");
const mailer = require('./email/mailer')

//find all
router.get("/getresellers", function (req, res) {
  resellerModule
    .find({})
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

//find one
router.get("/getreseller", function (req, res) {
  resellerModule
    .findOne({ "Contacts.CompanyName": req.query.companyName })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a reseller with this companyname!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/:id", function (req, res) {
  resellerModule.findById(req.params.id, function (err, reseller) {
    if (err) return res.status(500).send({ err });
    if (!reseller) return res.status(404).send("No reseller found.");
    res.status(200).send(reseller);
  });
});

router.post("/signup", (req, res) => {
  contactInfo = req.body.contact;
  adressInfo = req.body.adress;
  informationsInfo = req.body.informations;

  //creating contact data
  contact = { CompanyName: contactInfo.CompanyName, Logo: contactInfo.Logo };

  if (contactInfo.CompanyName == undefined) {
    return res.status(401).json({ Error: "Company Name is a required field!" });
  }
  if (contactInfo.hasOwnProperty("Email")) {
    if (!validator.isEmail(contactInfo.Email)) {
      return res.status(401).json({ Error: "Invalid Email format!" });
    } else {
      contact.Email = contactInfo.Email;
    }
  }
  if (contactInfo.hasOwnProperty("Phone")) {
    contact.Phone = contactInfo.Phone;
  }
  contact.Logo = contactInfo.Logo;

  //creating adress data
  adress = { Country: adressInfo.Country };
  if (adressInfo.Country == undefined) {
    return res.status(401).json({ Error: "Country is a required field!" });
  }
  if (adressInfo.hasOwnProperty("AddressLine1")) {
    adress.AddressLine1 = adressInfo.AddressLine1;
  }
  if (adressInfo.hasOwnProperty("AddressLine2")) {
    adress.AddressLine2 = adressInfo.AddressLine2;
  }
  if (adressInfo.hasOwnProperty("City")) {
    adress.City = adressInfo.City;
  }
  if (adressInfo.hasOwnProperty("State")) {
    adress.State = adressInfo.State;
  }
  if (adressInfo.hasOwnProperty("Zip")) {
    adress.Zip = adressInfo.Zip;
  }

  //creating informations data
  informations = {
    Email: informationsInfo.Email,
    Password: informationsInfo.Password,
  };


  if (informationsInfo.Email == undefined) {
    return res.status(401).json({ Error: "Email is a required field!" });
  }
  if (!validator.isEmail(informationsInfo.Email)) {
    return res.status(401).json({ Error: "Invalid Email format!" });
  }
  if (informationsInfo.Password == undefined) {
    return res.status(401).json({ Error: "Password is a required field!" });
  } else {
    informations.Password = bcrypt.hashSync(informations.Password);
  }
  if (informationsInfo.hasOwnProperty("FullName")) {
    informations.FullName = informationsInfo.FullName;
  }
  if (informationsInfo.hasOwnProperty("LastLogin")) {
    informations.LastLogin = informationsInfo.LastLogin;
  }

  

  const reseller = new resellerModule({
    Contacts: contact,
    Address: adress,
    Informations: informations,
  });

  resellerModule.findOne({ "Informations.Email": informationsInfo.Email }, function (err, result) {
    if(result){return res.status(401).json({ Error: "Email must be unique!" });}
else {
  reseller
    .save()
    .then((data) => {
      mailer.demande_ouverture_compte(informationsInfo.FullName , informationsInfo.Email)
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
  }
});
    
});


router.post("/modify/:id", (req, res) => {
  contactInfo = req.body.contact;
  adressInfo = req.body.adress;
  informationsInfo = req.body.informations;
  
  contact = { CompanyName: contactInfo.CompanyName };
  let myStatus = informationsInfo.Status;
  let myPassword = informationsInfo.Password;
  let myLogo = contactInfo.Logo;

  if (contactInfo.CompanyName == "") {
    return res.status(401).json({ Error: "Company Name is a required field!" });
  }
  if (contactInfo.hasOwnProperty("Email")) {
    if (!validator.isEmail(contactInfo.Email)) {
      return res.status(401).json({ Error: "Invalid Email format!" });
    } else {
      contact.Email = contactInfo.Email;
    }
  }
  if (contactInfo.hasOwnProperty("Phone")) {
    contact.Phone = contactInfo.Phone;
  }

  //creating adress data
  adress = {
    Country: adressInfo.Country,
    AddressLine1: adressInfo.AddressLine1,
  };

  if (adressInfo.hasOwnProperty("AddressLine1")) {
    adress.AddressLine1 = adressInfo.AddressLine1;
  }
  if (adressInfo.hasOwnProperty("AddressLine2")) {
    adress.AddressLine2 = adressInfo.AddressLine2;
  }
  if (adressInfo.hasOwnProperty("City")) {
    adress.City = adressInfo.City;
  }
  if (adressInfo.hasOwnProperty("State")) {
    adress.State = adressInfo.State;
  }
  if (adressInfo.hasOwnProperty("Zip")) {
    adress.Zip = adressInfo.Zip;
  }

  //creating informations data
  informations = { Email: informationsInfo.Email , creditLimit : informationsInfo.creditLimit};

  if (!validator.isEmail(informationsInfo.Email)) {
    return res.status(401).json({ Error: "Invalid Email format!" });
  }
  if (informationsInfo.hasOwnProperty("FullName")) {
    informations.FullName = informationsInfo.FullName;
  }
  if (informationsInfo.hasOwnProperty("LastLogin")) {
    informations.LastLogin = informationsInfo.LastLogin;
  }



  resellerModule.findById(req.params.id, function (err, resl) {
    
    if(resl.Informations.Password != myPassword) 
    {myPassword = bcrypt.hashSync(myPassword) ; console.log("yes") ;}
    if (resl.Contacts.Logo != myLogo && resl.Contacts.Logo != "avatar.png")
      fs.unlink("images\\" + resl.Contacts.Logo, (err) => {});
 

  informations.Password = myPassword;
  informations.Status = myStatus;
  informations.creditLimit = informationsInfo.creditLimit
  contact.Logo = myLogo;
  const reseller = new resellerModule({
    Contacts: contact,
    Address: adress,
    Informations: informations
  });

  if(resl.Informations.creditLimit != informationsInfo.creditLimit){
    mailer.changement_credit(resl.Contacts.CompanyName ,informationsInfo.creditLimit , resl.Informations.Email )
  }

  console.log(req.body)

  resellerModule
    .findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          Contacts: reseller.Contacts,
          Address: reseller.Address,
          Informations: reseller.Informations,
        },
      }
    )
    .then((data) => {
      return res.status(201).json({
        Result:
          data == null || data.modifiedCount == 0
            ? "Couldn't find this reseller!"
            : "Update has been made!",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
  });
});


router.post("/setStatus", (req, res) => {
  //Active , Blocked , OnHold
  email = req.body.email;
  newstatus = req.body.status;
  resellerModule
    .findOneAndUpdate(
      { "Informations.Email": email },
      { $set: { "Informations.Status": newstatus } }
    )
    .then((data) => {
      if(newstatus == 'Active'){
        mailer.compte_revendeur_cree(email , email)
      }
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

router.post("/setStatus", (req, res) => {
  //Active , Blocked , OnHold
  email = req.body.email;
  newstatus = req.body.status;
  resellerModule
    .findOneAndUpdate(
      { "Informations.Email": email },
      { $set: { "Informations.Status": newstatus } }
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

router.delete("/:id", function (req, res) {
  resellerModule.findByIdAndDelete(req.params.id, function (err, reseller) {
    if (reseller.Contacts.Logo != "avatar.png") {
      fs.unlink("images\\" + reseller.Contacts.Logo, (err) => {
        if (err)
          return res
            .status(500)
            .send("There was a problem deleting the reseller.");
        res.status(200).send(reseller);
      });
    } else res.status(200).send(reseller);
  });
});

const handleError = (err, res) => {
  res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "../images",
});

router.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    
    const tempPath = req.file.path;
    let nameFile = Date.now() + "-" + req.file.originalname;
    let name = "../images/" + nameFile;
    let targetPath = path.join(__dirname, name);

    if (
      path.extname(req.file.originalname).toLowerCase() === ".png" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpg"
    ) {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
        res.status(200).json(nameFile);
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return handleError(err, res);
        res.status(403).json({ Error: "Only .png/.jpg files are allowed!" });
      });
    }
  }
);

router.get("/getResellerByStatus/:status", function (req, res) {
  resellerModule
    .find({ "Informations.Status": req.params.status })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a reseller with this Status!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.post("/remove", function (req, res) {
  let name = req.body.name;
  fs.unlink("images\\" + name, (err) => {
    if (err) return handleError(err, res);
    res.status(200).json({ result: "Successfully deleted the file." });
  });
});

router.post("/setCredit", (req, res) => {
  
  id = req.body._id;
  creditUser = req.body.creditUser;
  resellerModule
    .findOneAndUpdate(
      { "_id": id },
      { $set: { "Informations.creditUser": creditUser } }
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
    subject: "Account status !! ⚠️", // Subject line
    html: `<h1>Hi ${user.name} your account now is ${user.status}</h1><br>
    <h4>Thanks for joining MSP</h4>`
  };


  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
 
  callback(info);
}


router.post("/register_sub_reseller", (req, res) => {
  Email = req.body.email;
  Password = req.body.password;
  SuperReseller = req.body.superReseller;

  if (Email == undefined) {
    return res.status(401).json({ Error: "Email is a required field!" });
  }
  if (!validator.isEmail(Email)) {
    return res.status(401).json({ Error: "Invalid Email format!" });
  }
  if (Password == undefined) {
    return res.status(401).json({ Error: "Password is a required field!" });
  } else {
    Password = bcrypt.hashSync(Password);
  }
  if (SuperReseller == undefined) {
    return res.status(401).json({ Error: "superReseller est obligatoire" });
  }

  const subReseller = new subResellerModule({
    Email: Email,
    Password: Password,
    SuperReseller: SuperReseller,
  });

  subResellerModule.findOne({ "Email": Email }, function (err, result) {
    if(result){return res.status(401).json({ Error: "Email must be unique!" });}
else {
  subReseller.save().then((data) => {
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
  }
});
    
});

router.get("/getSubResellers/:reseller", function (req, res) {
  subResellerModule.find({ "SuperReseller._id": req.params.reseller })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a subreseller for this reseller!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.delete("/SubReseller/:id", function (req, res) {

  subResellerModule.findByIdAndDelete(req.params.id, function (err, subResellerModule) {
    if (err)
      return res.status(500).send("There was a problem deleting the subreseller.");
    res.status(200).send(subResellerModule);
  });
});

router.get("/SubReseller/:id", function (req, res) {
  subResellerModule.findById(req.params.id, function (err, subResellerModule) {
    if (err) return res.status(500).send({ err });
    if (!subResellerModule) return res.status(404).send("No subreseller found.");
    res.status(200).send(subResellerModule);
  });
});

router.post("/updateSubReseller/:id", (req, res) => {
  Email = req.body.Email;
  Password = req.body.Password;
  
  let myPassword = Password;
  

  if (Email == undefined) {
    return res.status(401).json({ Error: "Email is a required field!" });
  }
  if (!validator.isEmail(Email)) {
    return res.status(401).json({ Error: "Invalid Email format!" });
  }
  if (Password == "") {
    return res.status(401).json({ Error: "Password is a required field!" });
  }



  subResellerModule.findById(req.params.id, function (err, resl) {
    
    if(resl.Password != myPassword) 
    {myPassword = bcrypt.hashSync(myPassword) ; console.log("yes") ;}
    
 

  Password = myPassword;
  
  const subreseller = new subResellerModule({
    Email: Email,
    Password: Password
    
  });

  subResellerModule
    .findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          Email: subreseller.Email,
          Password: subreseller.Password
          
        },
      }
    )
    .then((data) => {
      return res.status(201).json({
        Result:
          data == null || data.modifiedCount == 0
            ? "Couldn't find this reseller!"
            : "Update has been made!",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
  });
});





module.exports = router;
