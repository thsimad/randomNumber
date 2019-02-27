const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        expressSession  = require('express-session'),
        mongoose        = require('mongoose'),
        favicon         = require('serve-favicon')
        passport        = require('passport'),
        flash           = require('connect-flash'),
        LinkedInStrategy= require('passport-linkedin-oauth2').Strategy,
        googleStrategy          = require('passport-google-oauth20'),
        mongooseKey     = require('./private/mongooseKey'),
        methodOverride  = require('method-override'),
        nodemailer      = require('nodemailer'),
        indexRoutes     = require('./routes/indexRoutes'),
        authRoutes      = require('./routes/authRoutes'),
        User            = require('./models/user'),
        secCode         = require('./private/expressCode'),
        isLogedIn       = require('./private/isLogedIn'),
        linkedinKey     = require('./private/linkedinKey'),
        googleKeys      = require('./private/googleKeys'),
        port            = process.env.PORT || 3000,
        helmet          = require('helmet'),
        multer = require('multer')
        compression     = require('compression'),
        // fbkeys          = require('./private/facebookKey'),
        mailPs          = require('./private/mailPs'),
        FacebookStrategy= require('passport-facebook'),
        path            = require('path');
//mlab connect
// mongoose.connect('mongodb://localhost:27017/THS', {useNewUrlParser: true});
mongoose.connect(mongooseKey.url,  { useNewUrlParser: true })
//initializing helmet
app.disable( 'x-powered-by' );
app.use( helmet.hidePoweredBy());
app.use( helmet.hsts( { maxAge: 7776000000 } ) ) ;
app.use( helmet.frameguard( 'SAMEORIGIN' ) ) ;
app.use( helmet.xssFilter( { setOnOldIE: true } ) ) ;
app.use( helmet.noSniff() ) ;
//init compression
app.use(compression());
//config view engine
app.set('view engine', 'ejs');
//config bodyParser
app.use(bodyParser.urlencoded({extended: true}));
//making public folder static
app.use(express.static('public'));
//config methodOverride for put and delete routes
app.use(methodOverride('_method'));
//adding favicon to over webpage
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
//
// app.use(express.csrf());
// adding flash messages(success or error)
app.use(flash());
//Nodemailer Config
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: mailPs.email,
           pass: mailPs.password
       }
    });
//express-session config
app.use (expressSession({
    secret: secCode,
    resave: false,
    saveUninitialized: false
}));
//passport init
app.use (passport.initialize());
app.use (passport.session());
//passport LinkedIn Strategy & callback function. 
passport.use(new LinkedInStrategy({
    clientID: linkedinKey.clientId,
    clientSecret: linkedinKey.clientSecret,
    callbackURL: linkedinKey.callbackURL,
    scope: ['r_emailaddress', 'r_basicprofile'],
    }, function(accessToken, refreshToken, profile, done) {
            let data = profile;
            process.nextTick(function () {
                User.findOne({linkedinId: profile.id}).then((currentUser) => {
                    if(currentUser){
                        done(null, currentUser);
                    }else{
                        new User({ 
                            linkedinId: profile.id,
                            name: data.displayName,
                            email: data.emails[0].value,
                            linkedinProfileUrl: data._json.pictureUrl,
                            linkedinUrl: data._json.publicProfileUrl,
                            linkedinHeadline: data._json.headline
                            }, function (err, user) {
                                return cb(err, user);
                                }).save().then((newUser)=>{
                                    done(null, newUser);        
                                    });
                    }
                });
        });
  }));

  //facebook oauth
  //Facebook Oauth Config.
//   passport.use(new FacebookStrategy({
//     clientID: fbkeys.appId,
//     clientSecret: fbkeys.appSecret,
//     callbackURL: "http://schoolofcoding.in/register/facebook/redirect",
//     profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'accounts']
//     },
//     (accessToken, refreshToken, profile, done) => {
//         console.log(profile);
//         console.log(profile._json.accounts);
//         var email;
//         if(profile.emails === undefined){
//             email = null;
//         }else{
//             email = profile.emails[0].value;
//         }
//         var firstName;
//         if(profile._json.first_name === undefined){
//             firstName = "";
//         }else{
//             firstName = profile._json.first_name;
//         } 
//         var lastName;
//         if(profile._json.last_name === undefined){
//             lastName = "";
//         }else{
//             lastName = profile._json.last_name;
//         }
//         var middleName;
//         if(profile._json.middle_name === undefined){
//             middleName = "";
//         }else{
//             middleName = profile._json.middle_name;
//         }
//         var fblink;
//         if(profile._json.link === undefined){
//             fblink = "";
//         }else{
//             fblink = profile._json.link;
//         }
//         User.findOne({facebookId: profile.id}).then((currentUser) => {
//             if(currentUser){
//                 done(null, currentUser);
//             }else{
//                 new User({ 
//                     facebookId: profile.id,
//                     name: firstName+" "+middleName+" "+lastName,
//                     email: email,
//                     fblink: fblink,
//                     accounts: profile._json.accounts,
//                     facebookProfileUrl: profile.profileUrl

//                 }, function (err, user) {
//                 return cb(err, user);
//                 }).save().then((newUser)=>{
//                     done(null, newUser);        
//                 });
//             }
//         })
//     }
// ));
passport.use(
    new googleStrategy({
        callbackURL: googleKeys.redirectUrl,
        clientID: googleKeys.clientId,
        clientSecret: googleKeys.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                done(null, currentUser);
            }else{
                new User({ 
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                }, function (err, user) {
                  return cb(err, user);
                }).save().then((newUser)=>{
                    done(null, newUser);   
                });
            }
        })
      }
));

//Passport Config.
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    User.findById(user._id).then((user) => {
        done(null, user);
    });
});
//sending general data to every route.
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.errMessage = req.flash('error');
    res.locals.successMessage = req.flash('success');
    // res.locals.csrftoken = req.scrfToken()
    next();
});

//calling routes
app.use('/', indexRoutes);
app.use('/', authRoutes);
//routing mismatched routes to home.
app.get('*', (req, res)=>{
    res.redirect('/');
});
//making app to serve on port
app.listen(port, ()=>console.log('App is listening at post '+ port));
