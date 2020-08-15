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
            console.log(err);
            return res.render("register")
        }

        /**the authenticate method is the method that logs you in
         * it will check the user's username and password against the database
         * /the register method above only creates a new user in the database
         */
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
    
})

//showlogin form
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
    res.redirect("/campgrounds");
})
//=================

/**this is used to make sure user is logged in before
 * they can progress, otherwise send them to login page
 */
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;