const express = require('express'),
    router = express.Router();
//auth with linkedin
router.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE' }),
    function (req, res) {
    });
//linked auth callback
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/form',
    failureRedirect: '/register'
}));
router.get('/register/facebook',
    passport.authenticate('facebook', {
        scope: ['email']
    }), (req, res) => {
    });



router.get('/register/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/register/google/redirect', passport.authenticate('google', {
    failureRedirect: '/register'
}),
    function (req, res) {
        res.redirect('/form');
    });

router.get('/register/facebook/redirect',
    passport.authenticate('facebook', { failureRedirect: '/register' }),
    function (req, res) {
        res.redirect('/form');
    });
//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out!');
    res.redirect('/register');
});


module.exports = router
