var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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