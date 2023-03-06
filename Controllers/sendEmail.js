const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();
const GeneratorCodeModule = require('../Models/GenertaorCodeModule');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const details = require("../details.json");
var smtpTransport = require('nodemailer-smtp-transport');


router.get('/', async (req, res) => {
  email = "aziztarous@gmail.com"
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(smtpTransport({
    host: 'ssl0.ovh.net',
    port: 587,
    secureConnection: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD
    }
  }));
  let mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: email, // list of receivers
    subject: "Reset your password", // Subject line
    html: "<div style='padding: 80px;color:#96989f;font-size:20px;font-family: system-ui,sans-serif;'> <h2 style='font-size: 40px !important;font-weight: 900;color:black !important;font-family: system-ui,sans-serif;text-align: center;height:inherit'>Reset your password</h2> " +
      "<hr/><br/> <p style='color:#96989f;'> You're receiving this email because you requested a password reset for your <span style='font-weight: bold;''>MSP</span> account.</p> <p style='color:#96989f;'>Please tap the button below to choose a new password.</p><br/>" +
      "<a href='https://backoffice.sse.infraplus.net:10443/setInfos?e=" + email + "'>" +
      "<button style='background: linear-gradient( 45deg , #3f51b5, #00bcd4); color: white; padding: 15px 30px; font-weight: bold; border-radius: 20px; border-style: none; box-shadow: 10 10 10; box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19) !important;'>RESET PASSWORD</button></a></div>"
  };

  // send mail with defined transport object
  await transporter.sendMail(mailOptions).then(
    () => {
      return res.status(200).json({ "Result": "The Mail has been sended!" })
      //localStorage.setItem('email', email);
    }
  ).catch(error => {
    return res.status(401).json(error)
  });


})

router.post('/createCode', (req, res) => {

  const generatorCode = new GeneratorCodeModule({
    Code: req.body.Code,

  });

  generatorCode.save().then(data => {
    return res.status(201).json(data)
  }).catch(error => {
    return res.status(401).json(error)
  })

})

router.post('/generateCode', (req, res) => {

  const generateRandomString = (myLength) => {
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
  };

  const newCode = generateRandomString(15);
  GeneratorCodeModule.findOneAndUpdate(
    { "_id": "6361a191e4a13ebc814c27d9" },
    { $set: { "Code": newCode } }
  )
    .then((data) => {
      return res.status(201).json({ Result: data == null || data.modifiedCount == 0 ? "Couldn't find this Module!" : "Code has been changed " });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });

  sendMail(newCode, info => {
  });

  async function sendMail(newCode, callback) {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
      host: 'ssl0.ovh.net',
      port: 587,
      secureConnection: true,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      }
    }));
	console.log(process.env.MAILER_EMAIL);
    let mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: 'yassine.karrech@yahoo.com', // list of receivers
      subject: "Code de verification  🔑", // Subject line
      html: `<h1>Code :  ${newCode}  </h1><br>
        <h4>Thanks for joining MSP</h4>`
    };


    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    callback(info);
  }

})

router.post('/verifCode', (req, res) => {

  const verifCode = req.body.Code;
  GeneratorCodeModule
    .findOne({ "_id": "6361a191e4a13ebc814c27d9", "Code": verifCode })
    .then((data) => {
      if (data) {
        return res.status(200).send({ 'success': 'Code valide' });
      } else {
        return res
          .status(401)
          .json({ "Error": "Code invalid" });
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(401).json({ error });
    });
})


module.exports = router
