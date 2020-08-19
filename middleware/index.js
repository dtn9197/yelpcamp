var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "campground not found");
                //back means redirect back to the page user was before this call
                res.redirect("/back");
            } else {
                //does user id matches the author of campground
                /** the id in the campground is a mongoose object, not a string
                 * therefore use the mongoose method to compare
                 */
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }   
    
            }
        })

    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                //back means redirect back to the page user was before this call
                res.redirect("/back");
            } else {
                //does user id matches the comment they want to edit?
                /** the id in the comment is a mongoose object, not a string
                 * therefore use the mongoose method to compare
                 */
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permissoin to do that");
                    res.redirect("back");
                }   
    
            }
        })

    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

/**this is used to make sure user is logged in before
 * they can progress, otherwise send them to login page
 */
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;