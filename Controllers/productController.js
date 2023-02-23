const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const productModelSchema = require("../Models/ProductModel");
const subscriptionModelSchema = require('../Models/SubscriptionModel');

router.post("/create", async (req, res) => {
  const product = new productModelSchema({
    category: req.body.Category,
    product_name: req.body.Product_name,
    package: req.body.Package,
    type: req.body.Type,
    term: req.body.Term,
    SKU: req.body.Sku,
    description: req.body.Description,
    band_A: req.body.Band_A,
    band_B: req.body.Band_B,
    band_C: req.body.Band_C,
    band_D: req.body.Band_D,
    band_E: req.body.Band_E,
    band_K: req.body.Band_K,
    band_M: req.body.Band_M,
    band_N: req.body.Band_N,
    band_P: req.body.Band_P,
    band_Q: req.body.Band_Q,
    band_R: req.body.Band_R,
    band_S: req.body.Band_S,
    band_T: req.body.Band_T,
    quantity_min: req.body.Quantity_min,
    quantity_max: req.body.Quantity_max,
  });
  product
    .save()
    .then((data) => {
      
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/", function (req, res) {
  productModelSchema
    .find({})
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.get("/stat/:id", function (req, res) {
  subscriptionModelSchema.aggregate([
    {$match:{ "reseller._id": req.params.id}},
    {
      $group:
      {
          _id: '$customer',
          totalEmployee: { $sum: 1 },
      }
  }
])
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(error => {
        console.log(error)
    })
});

router.get("/stats", function (req, res) {
  productModelSchema.aggregate([
    {
      $group:
      {
          _id: '$category',
          totalEmployee: { $sum: 1 },
      }
  }
])
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(error => {
        console.log(error)
    })
});

router.put("/update/:id", (req, res) => {
  productModelSchema.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        category: req.body.Category,
        product_name: req.body.Product_name,
        package: req.body.Package,
        type: req.body.Type,
        term: req.body.Term,
        SKU: req.body.Sku,
        description: req.body.Description,
        band_A: req.body.Band_A,
        band_B: req.body.Band_B,
        band_C: req.body.Band_C,
        band_D: req.body.Band_D,
        band_E: req.body.Band_E,
        band_K: req.body.Band_K,
        band_M: req.body.Band_M,
        band_N: req.body.Band_N,
        band_P: req.body.Band_P,
        band_Q: req.body.Band_Q,
        band_R: req.body.Band_R,
        band_S: req.body.Band_S,
        band_T: req.body.Band_T,
        quantity_min: req.body.Quantity_min,
        quantity_max: req.body.Quantity_max,
      },
    }
  )
    .then((data) => {
      return res.status(201).json({
        Result:
          data == null || data.modifiedCount == 0
            ? "Couldn't find this product!"
            : "Update has been made!",
      });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

router.delete("/:id", function (req, res) {
  productModelSchema.findByIdAndDelete(req.params.id, function (err, p) {
    if (err)
      return res.status(500).send("There was a problem deleting the product.");
    res.status(200).send(p);
  });
});

router.get("/:id", function (req, res) {
  productModelSchema.findById(req.params.id, function (err, p) {
    if (err) return res.status(500).send({ err });
    if (!p) return res.status(404).send("No product found.");
    res.status(200).send(p);
  });
});

router.get("/stat", function (req, res) {
  subscriptionModelSchema.aggregate([
    {
        $group:
        {
          _id: { product: "$product" },
            totalProduct: { $sum: 1 } 
        }
    }
])
    .then(result => {
      
    })
    .catch(error => {
      return res.status(201).json(error);
    })
});

router.get("/getByProductName/:product", function (req, res) {
  productModelSchema.find({ "product_name": req.params.product })
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

router.get("/getProductbyCategory/:category", function (req, res) {
  productModelSchema
    .find({ "category": req.params.category })
    .then((data) => {
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(201)
          .json({ Result: "Couldn't find a product with this category!" });
      }
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
});

module.exports = router;
