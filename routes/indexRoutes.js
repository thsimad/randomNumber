const   express         = require('express'),        
        isLogedIn       = require('../private/isLogedIn'),
        User            = require('../models/user'),  
        nodemailer      = require('nodemailer'),
        mailPs          = require('../private/mailPs'),
        router          = express.Router();
//home route
let transporter = nodemailer.createTransport({
    host: 'malihasystemscom.ipage.com',
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized:false
    },
    auth: {
            user: mailPs.email,
            pass: mailPs.password
        }
});
router.get('/home', isLogedIn, (req, res)=>{
    if(req.user.designation === undefined){
        req.flash('error', 'Please add your details first.');
        res.redirect('/form')
    }else{
        res.render('home');
    }
});
router.get('/register', (req, res)=>{
    if(!req.user){
        res.render('register');
    }else{
        req.flash('success', ' ')
        res.redirect('/success')
    }
});
router.get('/form', isLogedIn, (req, res)=>{
    if(req.user.designation === undefined){
        res.render('form');        
    }else{
        req.flash('error', 'You have already submitted your request.');
        res.redirect('/home')
    }
});
router.put('/form',isLogedIn, (req, res)=>{
    let name        = req.body.name,
        email       = req.body.email.toLowerCase(),
        mobile      = req.body.mobile,
        location    = req.body.location,
        designation = req.body.designation,
        codingBackground = req.body.codingBackground,
        joiningObjective = req.body.joiningObjective,
        batchType        = req.body.batchType,
        source           = req.body.source,
        expectations     = req.body.expectations,
        recommendation   = req.body.recommendation,
        finassistance         = req.body.finassistance;
        console.log(req.body);
    User.findByIdAndUpdate(req.user._id, {
                                            applied: true,
                                            name:name, 
                                            email:email, 
                                            mobile:mobile, 
                                            location: location,
                                            designation:designation, 
                                            codingBackground:codingBackground, 
                                            joiningObjective:joiningObjective, 
                                            batchType:batchType, 
                                            source:source, 
                                            expectations: expectations,
                                            recommendation:recommendation,
                                            finassistance: finassistance}, (err, data)=>{
        if(err){
            console.log(err);
            req.flash('error', 'Something went wrong, please try again later!');
            res.redirect('/form')
        }else{
            console.log(data);
            User.find({role: 'admin'}, (err, admin)=>{
                if(admin){
                    console.log(admin);
                    admin.forEach((admin)=>{
                        console.log(admin.email);
                        let mail = admin.email;
                        mailOptions = {
                            from: '"The Hacking School" <app@thehackingschool.com>', // sender address
                            to: mail, // list of receivers
                            subject: 'New application received from '+data.name, // Subject line
                            html: ' <h1>'+name+'</h1></p> <h3>1. Name:</h3> <p>'+name+'</p> <h3>2. Email:</h3><p>'+email+'</p><h3>3. Mobile:</h3><p>'+mobile+'</p> <h3>4. What do you currently do?</h3><p>'+designation+'</p><h3>5. Do you have background in coding?</h3><p>'+codingBackground+'</p><h3>6. Your objective of joining our bootcamp Career</h3><p>'+joiningObjective+'</p><h3>7. Which batch are you looking to join?</h3><p>'+batchType+'</p> <h3>8. How did you hear about us?</h3><p>'+source+'</p> <h3>9. What is your expectation from the program?</h3><p>'+expectations+'</p>'
                                
                            };
                            transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                                console.log(err)
                            else
                                console.log(info);
                            });
                    });
                }
            });
            mailOptions = {
                from: '"The Hacking School" <app@thehackingschool.com>', // sender address
                to: email, // list of receivers
                subject: 'Application Received ', // Subject line
                html: '<html><head></head><body><div><p>Hi <strong>'+ name +'</strong>,<br><br>\
                Thank you for applying to the Full Stack Web Development. We appreciate your interest in joining <strong><i>The Hacking School - India’s First Coding Bootcamp.</i></strong><br>\
                <br>\
                We would like to inform you that we have successfully received your application. Our admissions team is currently reviewing all the applications and you’ll be receiving a call from the program team within the next 48 hours.</p> \
                \
                <p>In any case, we will keep you posted on the status of your application.</p>\
                <p><strong>Best Of Luck!</strong></p>\
                <p>Program Team</p></div>\
                \
                <div style="text-align: right; height: 50px; height: 30px;"><img src="https://i.imgur.com/EKxlhyS.png"></div><body></html> '
                    
                };
                transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                    console.log(err)
                else
                    console.log(info);
                });
            console.log(data);
            req.flash('success', 'Submitted your form successfully!');
            res.redirect('/success');
        }
    });
});
router.get('/success', isLogedIn, (req, res)=>{
    if(req.user.designation === undefined){
        req.flash('error', 'Please add your details first.');
        res.redirect('/form')
    }else{
        res.render('success');
    }
});
router.get('/admin', isLogedIn, (req, res)=>{
    if(req.user.role === 'admin'){
        User.find({}, (err, data)=>{
            if(err){
                console.log(err)
                req.flash('error', 'Something went wrong. Please try again later.');
                res.redirect('/home')
            }else{
                console.log(data);
                res.render('admin', {data: data});
            }
        })
    }else{
        res.redirect('/form')
    }
});
router.get('/applicantProfile-:id', isLogedIn, (req, res)=>{
    if(req.user.role === 'admin'){
        User.findById(req.params.id, (err, data)=>{
            if(err){
                console.log(err);
                req.flash('error', 'Something went wrong please try again later!');
                res.redirect('/admin');
            }else{
                res.render('applicantDetails', {data: data});
            }
        })
    }else{
        res.redirect('/form');
    }
})
module.exports = router
