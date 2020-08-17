var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const campground = require("../models/campground");

//INDEX ROUTE - show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            //if the user is logged in, passport will populate the req.user header with data which can be used
            //to prove that the user is logged in
             res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }   
        });
    
});

//NEW - show form to create new campground 
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new") 
 });

//SHOW - shows more info about campground selected - to be declared after NEW to not overwrite
router.get("/:id", function(req, res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err) {
           console.log(err);
       } else {
            //render show template with that campground
            
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});




//CREATE - add new campgrounds to database
router.post("/", isLoggedIn, function (req, res){
    // get data from form and add to campgrounds array
    var name= req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
   
   //create a new campground and save to db
   Campground.create(newCampground, function(err, newlyCreated){
      if (err) {
          console.log(err);
      } else {
          
           // redirect back to campgrounds page
          res.redirect("/campgrounds"); //
      }
   });
});



// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});

    })
});

// UPDATE ROUTE
router.put("/:id", checkCampgroundOwnership, function(req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            console.log("update succeed");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Campground Route
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
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
                    res.redirect("back");
                    console.log("You don't have permission");
                }   
    
            }
        })

    } else {
        console.log("you need to log in to do that");
        res.redirect("back");
    }
}

module.exports = router;