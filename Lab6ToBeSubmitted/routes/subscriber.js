/**
 * Created by Robel Woldu on 7/2/2017.
 */
var express = require('express');
//var app = require('app');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var csrf = require('csurf');
var fs =require('fs');
csrfProtection = csrf({ cookie: true });
var validator = require('express-validator')
 router.use(bodyParser.text());
 router.use(bodyParser.json());
 router.use(bodyParser.urlencoded({ extended: false }));
 router.use(validator());
 router.use(cookieParser());
 router.use(session({ secret: 'modern web app' ,resave: false, saveUninitialized: true}));
 router.use(csrf());


router.route('*')
.get(function(req,res,next){
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
});

router.route('/').post(function (req, res, next) {

    req.assert('email',' valid email is required').notEmpty().isEmail();
    var errors = req.validationErrors();

    if(errors) {
        res.render('subscriptionForm',{title:'subscribe', error:errors});
    }
    else{
        var logStream = fs.createWriteStream('./subscribersList.txt',{'flags':'a'});
        logStream.write(req.body.email+"\n");
        logStream.end();

        res.redirect('/newsletter/thankyou?email='+req.body.email);
    }
});

router.route('/thankyou')
.get(function(req,res){
    var subscriber_email = req.body.email;
    //res.locals = {email: subscriber_email} 
   var email = req.query.email
    res.render('thankyou',{email: email} );
});

router.route('/')
.get(function(req,res,next){
  res.render('subscriptionForm',{title:'subscribe',error:''});
});

module.exports = router;

