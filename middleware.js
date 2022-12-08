module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store what was user requesting if he was not logged in 
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}