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
router.get('/register/facebook',
    passport.authenticate('facebook',{
        scope:['email']
    }), (req, res)=>{
    });

router.get('/register/facebook/redirect',
    passport.authenticate('facebook', { failureRedirect: '/register' }),
    function(req, res) {
    res.redirect('/form');
    });
//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out!');
    res.redirect('/register');
});

        
module.exports = router
