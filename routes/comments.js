var express = require("express");

/**the mergedParams: true allows the route in this file to access
 * the /campgrounds/:id param from the main app.js
 */
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
const { response } = require("express");



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

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
   
});

//COMMENT UPDATE
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",checkCommentOwnership, function(req, res) {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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
function checkCommentOwnership(req, res, next) {
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
                    console.log("You don't have permission");
                    res.redirect("back");
                    
                }   
    
            }
        })

    } else {
        console.log("you need to log in to do that");
        res.redirect("back");
    }
}

module.exports = router;