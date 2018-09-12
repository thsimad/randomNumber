const   express         = require('express'),        
        router          = express.Router();
//auth with linkedin
router.get('/auth/linkedin',
passport.authenticate('linkedin', { state: 'SOME STATE'  }),
function(req, res){
});
//linked auth callback
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/form',
    failureRedirect: '/login'
}));
//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out!');
    res.redirect('/register');
});

        
module.exports = router
