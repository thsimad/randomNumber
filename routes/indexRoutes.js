const express = require('express'),
    isLogedIn = require('../private/isLogedIn'),
    User = require('../models/user'),
    nodemailer = require('nodemailer'),
    mailPs = require('../private/mailPs'),
    multer = require('multer'),
    path = require('path'),
    router = express.Router();
//home route
let transporter = nodemailer.createTransport({
    host: 'malihasystemscom.ipage.com',
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: mailPs.email,
        pass: mailPs.password
    }
});

const errorMail = (err) => {
    mailOptions = {
        from: '"School Of Coding" <info@schoolofcoding.in>', // sender address
        to: "imad@thehackingschool.com", // list of receivers
        subject: 'Error Occured', // Subject line
        html:   err };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}

const storage = multer.diskStorage({ // notice you are calling the multer.diskStorage() method here, not multer()
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.user._id + path.extname(file.originalname));
    }
  });
  
  //Init Upload.
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).single('resume');
  
  //Check file Type
  
  function checkFileType(file, cb) {
    //Allow ext
    const filetypes = /pdf|doc|docx/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Please upload your resume in pdf/doc/docx format only!');
    }
  }



router.get('/', (req, res) => {
    if (!req.user) {
        res.redirect('/register')
    } else {
        res.redirect('/form')
    }
})
router.get('/home', isLogedIn, (req, res) => {
    if (req.user.applied === false) {
        req.flash('error', 'Please add your details first.');
        res.redirect('/form')
    } else {
        res.render('home', {title: "School of coding -Home"});
    }
});
router.get('/register', (req, res) => {
    if (!req.user) {
        res.render('register',{title: "School of coding -Login or register"});
    } else {
        req.flash('success', ' ')
        res.redirect('/success')
    }
});
router.get('/form', isLogedIn, (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/admin')
    } else {
        if (req.user.applied === false) {
            res.render('form', {title: "School of coding -Application Form"});
        } else {
            req.flash('error', 'You have already submitted your request.');
            res.redirect('/home')
        }
    }
});
router.put('/form', isLogedIn, (req, res) => {
    console.log(req.body)
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            errorMail(err)
            req.flash("error", err)
            res.redirect('/form')
            // res.render('index', { msg: err })
        } else {
            if (req.file == undefined) {
                req.flash('error', 'Please upload your resume.')
                res.redirect('/form')
            } else {
                let name = req.body.name,
                    email = req.body.email.toLowerCase(),
                    mobile = req.body.mobile,
                    objective = req.body.objective,
                    ideas = req.body.ideas,
                    inspiredBy = req.body.inspiredBy,
                    source = req.body.source;

                console.log(req.body);
                User.findByIdAndUpdate(req.user._id, {
                    applied: true,
                    name: name,
                    email: email,
                    mobile: mobile,
                    joiningObjective: objective,
                    source: source,
                    inspiredBy: inspiredBy,
                    ideas: ideas
                }, (err, data) => {
                    if (err) {
                        console.log(err);
                        errorMail(err)            
                        req.flash('error', err);
                        res.redirect('/form')
                    } else {
                        console.log(data);
                        User.find({ role: 'admin' }, (err, admin) => {
                            if (admin) {
                                admin.forEach((admin) => {
                                    console.log(admin.email);
                                    let mail = admin.email;
                                    mailOptions = {
                                        from: '"School Of Coding" <info@schoolofcoding.in>', // sender address
                                        to: mail, // list of receivers
                                        subject: 'New application received from ' + data.name, // Subject line
                                        html: ' <h1>' + name + '</h1></p> <h3>1. Name:</h3> <p>' + name + '</p> <h3>2. Email:</h3><p>' + email + '</p><h3>3. Mobile:</h3><p>' + mobile + '</p> <h3>4. Why do you want to join this program?</h3><p>' + objective + '</p>'

                                    };
                                    transporter.sendMail(mailOptions, function (err, info) {
                                        if (err)
                                            console.log(err)
                                        else
                                            console.log(info);
                                    });
                                });
                            }
                        });
                        mailOptions = {
                            from: '"School Of Coding" <info@schoolofcoding.in>', // sender address
                            to: email, // list of receivers
                            subject: 'Application Received ', // Subject line
                            html: '<html><head></head><body><div><p>Hi <strong>' + name + '</strong>,<br><br>\
                Thank you for applying to the Full Stack Web Development. We appreciate your interest in joining <strong><i>School Of Coding - A pre-bootcamp to help you get started.</i></strong><br>\
                <br>\
                We would like to inform you that we have successfully received your application. Our admissions team is currently reviewing all the applications and you’ll be receiving a call from the program team within the next 48 hours.</p> \
                \
                <p>In any case, we will keep you posted on the status of your application.</p>\
                <p><strong>Best Of Luck!</strong></p>\
                <p>Program Team - +91 9959682957</p>\
                <p>School Of Coding</p></div>\
                \
                <div style="text-align: right; padding-right: 25px;"><a href="https://www.schoolofcoding.in"><img src="https://i.imgur.com/ICWk8Qf.png" style = "height: 75px; width: 110px;"></a></div><body></html> '

                        };
                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err)
                                console.log(err)
                            else
                                console.log(info);
                        });
                        req.flash('success', 'Submitted your form successfully!');
                        res.redirect('/success');
                    }
                });
            }
        }
    })

});
router.get('/success', isLogedIn, (req, res) => {
    if (req.user.applied === false) {
        req.flash('error', 'Please add your details first.');
        res.redirect('/form')
    } else {
        res.render('success',{title: "School of coding -Successfully applied"});
    }
});
router.get('/admin', isLogedIn, (req, res) => {
    if (req.user.role === 'admin') {
        User.find({}, (err, data) => {
            if (err) {
                console.log(err)
                errorMail(err)
                req.flash('error', 'Something went wrong. Please try again later.');
                res.redirect('/home')
            } else {
                console.log(data);
                res.render('admin', { data: data, title: "School of coding -Admin" });
            }
        })
    } else {
        res.redirect('/form')
    }
});
router.get('/applicantProfile-:id', isLogedIn, (req, res) => {
    if (req.user.role === 'admin') {
        User.findById(req.params.id, (err, data) => {
            if (err) {
                console.log(err);
                errorMail(err)           
                req.flash('error', 'Something went wrong please try again later!');
                res.redirect('/admin');
            } else {
                res.render('applicantDetails', { data: data, title: "School of coding -Users details" });
            }
        })
    } else {
        res.redirect('/form');
    }
});

router.get('/download/:id', isLogedIn, (req, res) => {
    res.download(__dirname + '/../uploads/resume-' + req.params.id + '.pdf')
  }) 
  
router.get('/admin/allusers', isLogedIn, (req, res)=>{
    if(req.user.role === 'admin'){
        User.find()
        .then((users)=>{
            res.render('allUsers', {users, title: "School of coding -All Users"})
        })
        .catch((err)=>{
            console.log(err)
            errorMail(err)
            req.flash('error', ("Something went wrong, Please try again later"))
            res.redirect('/admin')
        })
    }
})

module.exports = router
