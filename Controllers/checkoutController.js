const express = require("express");
const router = express.Router();
const bodyparser = require('body-parser');
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const cors = require('cors');
 
app.use(cors());

const stripe = require("stripe")("sk_test_0w9JdyiHjxNoBG9IP5YjJbfO00iTUfZceU");


router.post("/", (req, res) => {

    
  
    try {
        
        token = req.body.token
      const customer = stripe.customers
        .create({
          email: req.body.token.card.name,
          source: token.id
        })
        .then((customer) => {
          
          return stripe.charges.create({
            amount: req.body.amount,
            description: "welcome to MSP",
            currency: "eur",
            customer: customer.id,
          });
        })
        .then((charge) => {
          
            res.json({
              data:"success"
          })
        })
        .catch((err) => {
            res.json({
              data: "failure",
            });
        });
      return true;
    } catch (error) {
      return false;
    }
    
  
  });


  module.exports = router;
