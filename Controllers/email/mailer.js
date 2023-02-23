const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
module.exports = {
    alimenter_credit : function(name,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/alimenter_credit.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },

    arrete_change_souscription : function(name,client,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/arrete_change_souscription.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name,
                client : client
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },

    changement_credit : function(name,montant,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/changement_credit.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name,
                montant : montant
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },

    commande_souscription : function(name,produits ,client ,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/commande_souscription.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name,
                client : client,
                produits : produits 
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },

    compte_revendeur_cree : function(name,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/compte_revendeur_cree.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },

    demande_ouverture_compte : function(name,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/demande_ouverture_compte.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },

    facture_comptable : function(name,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/facture_comptable.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },

    suspend : function(name,email){
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;
                }
                else {
                    callback(null, html);
                }
            });
        };
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        });
        readHTMLFile('./Controllers/email/suspend.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name : name
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Notification',    
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error){
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    },
    
   
}



