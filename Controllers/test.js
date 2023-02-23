const router = require('express').Router()
const mailer = require('./email/mailer')

module.exports = router

router.get('/test',async(req,res)=>{
    try {
        var nom = "Ghaith"
        mailer.suspend(nom,"zghidig@gmail.com")
        res.status(200).json("ok")
    } catch (error) {
        res.status(500).json(error.message)
    }
})