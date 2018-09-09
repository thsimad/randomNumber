const flash = require('connect-flash');

const isLogdIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Login First!");
	res.redirect('/register');
}

module.exports = isLogdIn;