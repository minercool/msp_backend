const { json } = require('body-parser');
const express =require('express')
const router = express.Router()
const axios = require('axios').default;
const fs = require('fs');
const https = require('https');
const subscriptionModelSchema = require('../Models/SubscriptionModel');
const Invoice = require('../Models/invoiceModel');
const productModelSchema = require("../Models/ProductModel");

const mailer = require('./email/mailer')


router.get('/getdetails',async (req,res)=>{
  try{
    const CREDENTIALS = {
        "certurl": process.env.CERTURL,
        "pfx": fs.readFileSync(__dirname + '/../certif/cbd77447463b43a3a406f809fe046e9fbae30ee6ab5149509bd9a92523888b84.pfx'),
        "passphrase": process.env.PASSPHRASE2,
        }
  
        
        
      
        const options = {
          url: CREDENTIALS.certurl + `/Subscriptions/v2.0/api/Subscription/getdetails?SubscriptionId=${req.query.SubscriptionId}`,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          method: 'get',
          httpsAgent : new https.Agent({
              passphrase: CREDENTIALS.passphrase,
              pfx: CREDENTIALS.pfx
          })
      }
      // execute request
      await axios(options).then(result => {
        return res.status(201).json(result.data)
               
      }).catch(error =>{
        return res.status(401).json(error)
    });
  }catch(error){
    return res.status(402).json("region subscription error")
  }   
});

router.post('/create',async (req,res)=>{
  try{
  let data = req.body;
  
  const CREDENTIALS = {
      "certurl": process.env.CERTURL,
      "pfx": fs.readFileSync(__dirname + '/../certif/cbd77447463b43a3a406f809fe046e9fbae30ee6ab5149509bd9a92523888b84.pfx'),
      "passphrase": process.env.PASSPHRASE2,
      }
    
    

      const options = {
        url: CREDENTIALS.certurl + `/Subscriptions/v2.0/api/Subscription/create`,
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data:data,
        httpsAgent : new https.Agent({
            passphrase: CREDENTIALS.passphrase,
            pfx: CREDENTIALS.pfx
        })
    }

    // execute request
    await axios(options).then(result => {
      this.sub_id = result.data.SubscriptionId;
      console.log(req.body.reseller.Informations.FullName, req.body.product , req.body.Customer.Contacts.companyName , req.body.reseller.Informations.Email)
      try {
        mailer.commande_souscription(req.body.reseller.Informations.FullName, req.body.product , req.body.Customer.Contacts.companyName , req.body.reseller.Informations.Email)
        console.log(req.body.reseller.Informations.FullName, req.body.product , req.body.Customer.Contacts.companyName , req.body.reseller.Informations.Email)
    } catch (error) {
      res.status(500).json(error.message)
    }
      const subData = {
        sub : this.sub_id, 
        status: "active",
        customer : req.body.Customer.Contacts.companyName,
        product : req.body.product,
        quantity : req.body.Quantity,
        reseller : req.body.reseller,
        approvalCode : req.body.ApprovalCode,
        
        
    }

    
     subscriptionModelSchema.create(subData).then(subData => {
      
          
         
      
  });
      return res.status(201).json(result.data);

      

    }).catch(error =>{
      console.log(error.response.data.Message)
      return res.status(401).json({ Error: error.response.data.Message })
  })

    
  }catch(error){
    return res.status(402).json("region subscription error")
  }    
});






router.post('/modifyquantity',async (req,res)=>{
  try{
  let data = req.body
  const CREDENTIALS = {
      "certurl": process.env.CERTURL,
      "pfx": fs.readFileSync(__dirname + '/../certif/4a1b6f2b91e14bdebdbacfe4cc2840b0744377bc29554a108d93075d2fe965a5.pfx'),
      "passphrase": process.env.PASSPHRASE,
      }
    
    
      const options = {
        url: CREDENTIALS.certurl + `/Subscriptions/v2.0/api/Subscription/modifyquantity`,
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data:data,
        httpsAgent : new https.Agent({
            passphrase: CREDENTIALS.passphrase,
            pfx: CREDENTIALS.pfx
        })
    }
    // execute request
    await axios(options).then(result => {
      subscriptionModelSchema.findOneAndUpdate({ sub: req.body.SubscriptionId }, {
        $set: {
          quantity: req.body.Quantity
          
        }
      }, (err, doc) => {
        if (err) console.log("Something wrong when updating data!");
        
    });
      return res.status(201).json(result.data);
    }).catch(error =>{
      return res.status(401).json(error)
  });
}catch(error){
  return res.status(402).json("region subscription error")
}   
});

router.put('/code',async (req,res)=>{
  try{
  let data = req.body
  const CREDENTIALS = {
      "certurl": process.env.CERTURL,
      "pfx": fs.readFileSync(__dirname + '/../certif/4a1b6f2b91e14bdebdbacfe4cc2840b0744377bc29554a108d93075d2fe965a5.pfx'),
      "passphrase": process.env.PASSPHRASE,
      }
    
    
      const options = {
        url: CREDENTIALS.certurl + `/Subscriptions/v2.0/api/Subscription/modifyattributes`,
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data:data,
        httpsAgent : new https.Agent({
            passphrase: CREDENTIALS.passphrase,
            pfx: CREDENTIALS.pfx
        })
    }
    // execute request
    await axios(options).then(result => {
      subscriptionModelSchema.findOneAndUpdate({ sub: req.body.SubscriptionId }, {
        $set: {
          approvalCode: req.body.ApprovalCode
          
        }
      }, (err, doc) => {
        if (err) console.log("Something wrong when updating data!");
        
    });
      return res.status(201).json(result.data);
    }).catch(error =>{
      console.log(error)
      return res.status(401).json({Error: error.response.data.Message})
  });
}catch(error){
  return res.status(402).json("region subscription error")
}      
});


router.post('/hardcancel',async (req,res)=>{
  try{
  let data = req.body
  const CREDENTIALS = {
      "certurl": process.env.CERTURL,
      "pfx": fs.readFileSync(__dirname + '/../certif/4a1b6f2b91e14bdebdbacfe4cc2840b0744377bc29554a108d93075d2fe965a5.pfx'),
      "passphrase": process.env.PASSPHRASE,
      }
    
    
      const options = {
        url: CREDENTIALS.certurl + `/Subscriptions/v2.0/api/Subscription/hardcancel`,
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data:data,
        httpsAgent : new https.Agent({
            passphrase: CREDENTIALS.passphrase,
            pfx: CREDENTIALS.pfx
        })
    }
    // execute request
    await axios(options).then(result => {
    //mailer.suspend(name , email) ;
    subscriptionModelSchema.findOneAndUpdate({ sub: req.body.SubscriptionId }, {
      $set: {
        status: "HardCanceled"
        
      }
    }, (err, doc) => {
      if (err) console.log("Something wrong when updating data!");
      
  });
      
      return res.status(201).json(result.data);
      

    }).catch(error =>{
      return res.status(401).json(error.response.data)
  });
}catch(error){
  return res.status(402).json("region subscription error")
}       
});

router.get("/getall", function (req, res) {
  subscriptionModelSchema.find({}).then((data) => {
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

//find one sub
router.get("/:id", function (req, res) {
  subscriptionModelSchema.findById(req.params.id, function (err, customer) {
    if (err) return res.status(500).send({ err });
    if (!customer) return res.status(404).send("No customer found.");
    res.status(200).send(customer);
  });
});

router.get("/getByStatus/:status", function (req, res) {
  subscriptionModelSchema.find({ "status": req.params.status })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a sub with this Status!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/getByStatus/:status/:reseller", function (req, res) {
  subscriptionModelSchema.find({ "status": req.params.status,"reseller._id": req.params.reseller })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a sub with this Status!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/getByReseller/:reseller", function (req, res) {
  subscriptionModelSchema.find({ "reseller._id": req.params.reseller })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a sub with this reseller!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/getByCustomer/:customer", function (req, res) {
  console.log("hello" , customer);
  subscriptionModelSchema.find({ customer: req.params.customer })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {

        return res
          .status(201)
          .json({ Result: "Couldn't find a sub with this reseller!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.post('/modifyexpiration',async (req,res)=>{
  try{
  let data = req.body
  const CREDENTIALS = {
      "certurl": process.env.CERTURL,
      "pfx": fs.readFileSync(__dirname + '/../certif/4a1b6f2b91e14bdebdbacfe4cc2840b0744377bc29554a108d93075d2fe965a5.pfx'),
      "passphrase": process.env.PASSPHRASE,
      }


      const options = {
        url: CREDENTIALS.certurl + `/Subscriptions/v2.0/api/Subscription/modifyexpiration`,
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        data:data,
        httpsAgent : new https.Agent({
            passphrase: CREDENTIALS.passphrase,
            pfx: CREDENTIALS.pfx
        })
    }
    // execute request
    await axios(options).then(result => {
      return res.status(201).json(result.data);
    }).catch(error =>{
      return res.status(401).json(error)
  });
    

}catch(error){
  return res.status(402).json("region subscription error")
}   
});




module.exports = router
