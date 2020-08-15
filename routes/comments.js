var express = require("express");

/**the mergedParams: true allows the route in this file to access
 * the /campgrounds/:id param from the main app.js
 */
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");



/**the comment routes use a middleware function
 * to check whether user is logged in before they can post ocmments
 */

router.get("/new", isLoggedIn, function(req, res) {
    console.log("comments new route hit");
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    

});

//comment create
router.post("/",isLoggedIn, function(req, res) {
    //look up campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    
});

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