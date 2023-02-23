const express =require('express')
const router = express.Router()
const signModules = require('../Models/distributorModel')
const resellerModule = require('../Models/resellerModel')
const subResellerModule = require('../Models/SubResellerModel')
const validator = require('validator');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var transport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'siwar.benfakhta@gmail.com',
      pass: 'blpocttmkdmozaph'
    },tls: {
      ciphers: 'SSLv3'
  },
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});


router.post('/signin',(req,res)=>{
    email=req.body.Email;
    password=req.body.Password;
    if(!validator.isEmail(email)){
        res.status(401).json({"Error":"Invalid Email format!"})
    }else if(!validator.isLength(password,{min:8, max: 50})){
        res.status(401).json({"Error":"Password length should be between 8 and 50 characters!"})
    }else

    signModules.findOne({Email: email}).then(data =>{
        if(bcrypt.compareSync(password, data.Password)){
            const id = data._id;
            const role = "Admin";

            const token = jwt.sign(
                { id, role },
                process.env.TOKEN_KEY
              );
            return res.status(201).json({token , data })
        }else{
            res.status(401).json({"Error":"Wrong Password!"})
        }
    }).catch(error =>{
        resellerModule.findOne(
            {"Informations.Email": email}).then(data =>{
            if(bcrypt.compareSync(password, data.Informations.Password)){
                mystatus = data._doc.Informations.Status
                if(mystatus ==='Active'){
                const id = data._id;    
                const role = "Reseller";
                const token = jwt.sign(
                    { id, role},
                    process.env.TOKEN_KEY
                );
                    return res.status(201).json({token , data})
                }else if(mystatus ==='OnHold'){
                    return res.status(403).json({"Error":"This account is still on hold!"})
                }else{
                    return res.status(402).json({"Error":"This account is blocked!"})
                }
            }
            else {
                return res.status(401).json({"Error":"Wrong Password!"})
            }
            
        }).catch(error =>{
            subResellerModule.findOne(
                {"Email": email}).then(data =>{
                if(bcrypt.compareSync(password, data.Password)){

                    const id = data._id;    
                    const role = "SubReseller";
                    const token = jwt.sign(
                        { id, role},
                        process.env.TOKEN_KEY
                    );
                        return res.status(201).json({token , data})
                   
                }
                else {
                    return res.status(401).json({"Error":"Wrong Password!"})
                }
        })



    }).catch(error =>{
        console.log(error)
        res.status(401).json({"Error":"Email not found!"})
    })
})
})
const Invoice = require("../Models/invoiceModel");


router.post('/resetPassword', function(req, res){
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        resellerModule.findOne({ "Informations.Email": req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(404).send('No user found.');
                }
                user.Informations.resetToken = token;
                user.Informations.resetTokenExpiration = Date.now() + 3600000
                ;
                user.save();
            }).then(result => {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'siwar.benfakhta@gmail.com',
                    subject: 'Password reset',
                    html: "<div style='padding: 80px;color:#96989f;font-size:20px;font-family: system-ui,sans-serif;'> <h2 style='font-size: 40px !important;font-weight: 900;color:black !important;font-family: system-ui,sans-serif;text-align: center;height:inherit'>Reset your password</h2> "+
                    "<hr/><br/> <p style='color:#96989f;'> You're receiving this email because you requested a password reset for your <span style='font-weight: bold;''>MSP</span> account.</p> <p style='color:#96989f;'>Please tap the button below to choose a new password.</p><br/>"+
                    "<a href='http://localhost:4200/reset-password/"+token+"'>"+
                    "<button style='background: linear-gradient( 45deg , #3f51b5, #00bcd4); color: white; padding: 15px 30px; font-weight: bold; border-radius: 20px; border-style: none; box-shadow: 10 10 10; box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19) !important;'>RESET PASSWORD</button></a></div>"
                });
                return res.status(200).send({'email': 'email was sended successfully'});
            }).catch(err => {
                console.log(err);
            });
    });
});

router.post('/check/:token', function(req , res){
    const token = req.params.token;
    resellerModule
    .findOne({"Informations.resetToken" : token ,  "Informations.resetTokenExpiration": { $gt: Date.now() }})
    .then((data) => {
      if (data) {
            return res.status(200).send({'success': 'Token still valid'});
      } else {
        return res
          .status(401)
          .json({"Error":"Lien de réinitilisation expiré"});
      }
    })
    .catch((error) => {
        console.log(error)
      return res.status(401).json({"Error":"Lien de réinitilisation expiré"});
    });

});

router.post('/reset/:token', function(req , res){
    const newPassword = req.body.password;
    const token = req.params.token;
    let resetUser ;
    resellerModule
    .findOne({"Informations.resetToken" : token ,  "Informations.resetTokenExpiration": { $gt: Date.now() }})
    .then((data) => {
      if (data) {
            resetUser = data ;
            resetUser.Informations.Password = bcrypt.hashSync(newPassword);
            resetUser.Informations.resetToken = undefined;
            resetUser.Informations.resetTokenExpiration = undefined;
            resetUser.save();
            return res.status(200).send({'password': 'password updated successfully'});
      } else {
        return res
          .status(401)
          .json({"Error":"Lien de réinitilisation expiré"});
      }
    })
    .catch((error) => {
        console.log(error)
      return res.status(401).json({"Error":"Lien de réinitilisation expiré"});
    });

});



module.exports = router
