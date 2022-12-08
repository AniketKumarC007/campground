const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); //it takes the password ,salts it , hashes it then finally stores the hashed salted password
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
});

router.get('/login', (req, res) => {
    res.render('users/login');
})
// local keyword is the strategy , it can also be like google , twitter ,facebbok . And failure flash comes predefined with passport
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'; // if initially user wasnt requesting any page that requires login , we will redirect him to simply campgrounds page 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    });
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
})

module.exports = router;
//req.login() and req.logout comes in predefined with passport.js