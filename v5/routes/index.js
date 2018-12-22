const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport    = require("passport");

router.get("/", (request, response)=> {
    response.render("landing");
});

router.get('/register', (request, response)=> {
    response.render('register');
});

router.post('/register', (request, response)=> {
    const user = new User({username: request.body.username});
    User.register(
        user,
        request.body.password,
        (error, user)=> {
            if (error) {
                console.log(error);
                request.flash("warning", error.message);
                return response.render('register');
            }
            passport.authenticate('local')(request, response, ()=> {
                request.flash("success", "Welcome " + user.username);
                response.redirect('/campgrounds');
            });
        });
});

router.get('/login', (request, response)=> {
    response.render('login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    (request, response)=> {
    response.send("Login happens here");
});

router.get('/logout', (request, response)=> {
   request.logout();
   request.flash("success", "Logged you out.");
   response.redirect('/campgrounds');
});



module.exports = router;