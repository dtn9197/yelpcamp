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
    /**lookup campground by id
     * create a comment
     *    associate the userID with the comments then save it
     * push the comment into the campground and save
     * redirect to show campground
     */
  
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //add username and id to comment then save it
                    //req.user._id is available if the user is login with passport
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
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