const   express     = require('express'),        
        isLogedIn   = require('../private/isLogedIn'),
        User        = require('../models/user'),  
        nodemailer      = require('nodemailer'),
        mailPs          = require('../private/mailPs'),
        router      = express.Router();
//home route
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: mailPs.email,
           pass: mailPs.password
       }
   });
router.get('/home', isLogedIn, (req, res)=>{
    res.render('home');
});
router.get('/register', (req, res)=>{
    if(!req.user){
        res.render('register');
    }else{
        res.redirect('/profile')
    }
});
router.get('/form', isLogedIn, (req, res)=>{
    res.render('form');
});
router.put('/form',isLogedIn, (req, res)=>{
    let name        = req.body.name,
        email       = req.body.email.toLowerCase(),
        mobile      = req.body.mobile,
        description = req.body.description,
        skills      = req.body.skills,
        userBuild   = req.body.userBuild,
        location    = req.body.location,
        facebook    = req.body.facebook,
        twitter     = req.body.twitter,
        linkedin    = req.body.linkedin,
        skypeId     = req.body.skypeId
        designation = req.body.designation,
        codingBackground = req.body.codingBackground,
        joiningObjective = req.body.joiningObjective,
        batchType        = req.body.batchType,
        source           = req.body.source,
        expectations     = req.body.expectations
        recommendation   = req.body.recommendation;
        console.log(req.body);
    User.findByIdAndUpdate(req.user._id, {
                                            name:name, 
                                            email:email, 
                                            mobile:mobile, 
                                            description:description, 
                                            skills:skills, 
                                            userBuild:userBuild,
                                            location: location,
                                            links:{
                                                facebook:facebook, 
                                                linkedin:linkedin, 
                                                twitter:twitter
                                            },
                                            skypeId: skypeId, 
                                            designation:designation, 
                                            codingBackground:codingBackground, 
                                            joiningObjective:joiningObjective, 
                                            batchType:batchType, 
                                            source:source, 
                                            expectations: expectations,
                                            recommendation:recommendation}, (err, data)=>{
        if(err){
            console.log(err);
            req.flash('error', 'Something went wrong, please try again later!');
            res.redirect('/form')
        }else{
            var mailOptions = {
                from: '"The Hacking School" <erimadahmad@gmail.com>', // sender address
                to: 'meraj@thehackingschool.com', // list of receivers
                subject: 'New application received from '+data.name, // Subject line
                html: ' <h1>'+data.name+'</h1><h3>Skills:</h3> <p>'+data.skills+'</p> <h3>1. Name:</h3> <p>'+data.name+'</p> <h3>2. Email:</h3><p>'+data.email+'</p><h3>3. Mobile:</h3><p>'+data.mobile+'</p> <h3>4. What do you currently do?</h3><p>'+data.designation+'</p><h3>5. Do you have background in coding?</h3><p>'+data.codingBackground+'</p><h3>6. Your objective of joining our bootcamp Career</h3><p>'+data.joiningObjective+'</p><h3>7. Which batch are you looking to join?</h3><p>'+data.batchType+'</p> <h3>8. How did you hear about us?</h3><p>'+data.source+'</p> <h3>9. What is your expectation from the program?</h3><p>'+data.expectations+'</p>'
                 
              };
              transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                  console.log(err)
                else
                  console.log(info);
             });
              transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                  console.log(err)
                else
                  console.log(info);
             });
            console.log(data);
            req.flash('success', 'Submitted your form successfully!');
            res.redirect('/home');
        }
    });
});
module.exports = router
