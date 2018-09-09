const   express     = require('express'),        
        isLogedIn   = require('../private/isLogedIn'),
        User        = require('../models/user'),  
        router      = express.Router();
//home route
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
router.put('/form', isLogedIn, (req, res)=>{
    let name        = req.body.name,
        email       = req.body.email,
        mobile      = req.body.mobile,
        description = req.body.description,
        skills      = req.body.skills,
        userBuild   = req.body.userBuild,
        facebook    = req.body.facebook,
        twitter     = req.body.twitter,
        linkedin    = req.body.linkedin,
        designation = req.body.designation,
        codingBackground = req.body.codingBackground,
        joiningObjective = req.body.joiningObjective,
        batchType        = req.body.batchType,
        source           = req.body.source,
        recommendation   = req.body.recommendation;
    User.findByIdAndUpdate(req.user._id, {
                                            name:name, 
                                            email:email, 
                                            mobile:mobile, 
                                            description:description, 
                                            skills:skills, 
                                            userBuild:userBuild,
                                            links:{
                                                facebook:facebook, 
                                                linkedin:linkedin, 
                                                twitter:twitter
                                            }, 
                                            designation:designation, 
                                            codingBackground:codingBackground, 
                                            joiningObjective:joiningObjective, 
                                            batchType:batchType, source:source, 
                                            recommendation:recommendation}, (err, data)=>{
        if(err){
            console.log(err);
            req.flash('error', 'Something went wrong, please try again later!');
        }else{
            console.log(data);
            req.flash('success', 'Submitted your form successfully!');
            res.redirect('/home');
        }
    });
});
module.exports = router
