const express =require('express')
const router = express.Router()
const DistrubutorModule = require('../Models/DistributorModule')


//find all
router.get('/getAll', function(req, res) {
    DistrubutorModule.find({}).populate('Clients').then(data =>{
        return res.status(201).json(data)
    }).catch(error =>{
        return res.status(401).json(error)
    });
  });


//find one
  router.get('/getByEmail', function(req, res) {
    DistrubutorModule.findOne({"Email":req.query.email}).populate('Clients').then(data =>{
        if(data){
            return res.status(201).json(data)
        }else{
            return res.status(201).json({"Result":"Couldn't find a Distributor with this Email!"})
        }
        
    }).catch(error =>{
        return res.status(401).json(error)
    });
  });

//create
router.post('/create',(req,res)=>{

    const distrubutor = new DistrubutorModule({
        Email:req.body.Email,
        Clients:req.body.Clients
    });

    distrubutor.save().then(data =>{
        return res.status(201).json(data)
    }).catch(error =>{
        return res.status(401).json(error)
    })

})

/*
router.post('/modify',(req,res)=>{
    contactInfo=req.body.contact;
    adressInfo=req.body.adress;

    //creating contact data
    contact={CompanyName: contactInfo.CompanyName};
    
    if(contactInfo.CompanyName==undefined){
        return res.status(401).json({"Error":"Company Name is a required field!"})
    }
    if(contactInfo.hasOwnProperty('Email')){
        contact.Email=contactInfo.Email;
    }
    if(contactInfo.hasOwnProperty('Phone')){
        contact.Phone=contactInfo.Phone;
    }
    if(contactInfo.hasOwnProperty('resellerCode')){
        contact.resellerCode=contactInfo.resellerCode;
    }

    //creating adress data
    adress={Country: adressInfo.Country};
    if(adressInfo.Country==undefined){
        return res.status(401).json({"Error":"Country is a required field!"})
    }
    if(adressInfo.hasOwnProperty('AddressLine1')){
        adress.AddressLine1=adressInfo.AddressLine1;
    }
    if(adressInfo.hasOwnProperty('AddressLine2')){
        adress.AddressLine2=adressInfo.AddressLine2;
    }
    if(adressInfo.hasOwnProperty('City')){
        adress.City=adressInfo.City;
    }
    if(adressInfo.hasOwnProperty('State')){
        adress.State=adressInfo.State;
    }
    if(adressInfo.hasOwnProperty('Zip')){
        adress.Zip=adressInfo.Zip;
    }



    const reseller = new resellerModule({
        Contacts:contact,
        Address:adress
    });


    resellerModule.findOneAndUpdate(
        {"Contacts.CompanyName": reseller.Contacts.CompanyName}
        ,{$set: {'Contacts': reseller.Contacts,'Address':reseller.Address}}).then(data =>{
        return res.status(201).json({"Result":data.modifiedCount==0?"Couldn't find a reseller with this companyname!":"Update has been made!"})
    }).catch(error =>{
        return res.status(401).json(error)
    })

})


//Delete
router.delete('/delete',(req,res)=>{
    contactInfo=req.body.contact;
    adressInfo=req.body.adress;

    //creating contact data
    contact={CompanyName: contactInfo.CompanyName};
    
    if(contactInfo.CompanyName==undefined){
        return res.status(401).json({"Error":"Company Name is a required field!"})
    }

    //creating adress data
    adress={Country: adressInfo.Country};
    if(adressInfo.Country==undefined){
        return res.status(401).json({"Error":"Country is a required field!"})
    }

    resellerModule.findOneAndDelete(
        {"Contacts.CompanyName": contactInfo.CompanyName,
        'Address.Country':adressInfo.Country}).then(data =>{
            if(data){
                return res.status(201).json({"Result":"The reseller has been deleted!"})
            }else{
                return res.status(201).json({"Result":"Couldn't find a reseller with this companyname and country!"})
            }
        
    }).catch(error =>{
        return res.status(401).json(error)
    })

})

*/

module.exports = router