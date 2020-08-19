var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



router.get("/", function(req, res) {
    res.render("landing");
});

//=====AUTHENTICATION ROUTES======

//show register form
router.get("/register", function(req, res) {
    res.render("register");
})

//sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});

    //register new user, pass in userObject and password, and store a 
    //hashed password in mongodb database
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("register");
        }

        /**the authenticate method is the method that logs you in
         * it will check the user's username and password against the database
         * /the register method above only creates a new user in the database
         */
        passport.authenticate("local")(req, res, function() {
            //warning error
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
    
})

//showlogin form
//req.flash is the temporary message that lets uers know they
//need to login
router.get("/login", function(req, res) {
    res.render("login");
});

//login logic
/**this routes takes username and password from the login form */
router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
        
    
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
})

module.exports = router;