const user = require("./models/user");

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment");
    
seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useUnifiedTopology: true,  useNewUrlParser: true }); //create yelpcamp db inside mongodb
app.use(bodyParser.urlencoded({extended: true}));

//the public directory is used for assets, stylesheets, scripts
/**use express.static to set a certain path as a "root" directory
 * that folder then can be referred as / when linking stylesheets or scripts
 */
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//======= PASSPORT CONFIGURATION=============
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialize: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=============================================

//app.use(<function>) will call the function on every single route
app.use(function(req, res, next) {
    /**whatever we put inside res.locals will be available
     * inside our templates
     */
    res.locals.currentUser = req.user;
    //use next() to make it move on to the next function call
    //without next it will just stop
    next();
});   
app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req, res) {
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
app.post("/campgrounds", function (req, res){
    // get data from form and add to campgrounds array
    var name= req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
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
app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new") 
});

//SHOW - shows more info about campground selected - to be declared after NEW to not overwrite
app.get("/campgrounds/:id", function(req, res){
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

// =========================
//Comments Routes
/**the comment routes use a middleware function
 * to check whether user is logged in before they can post ocmments
 */
// =========================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    

});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res) {
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

//=====AUTHENTICATION ROUTES======

//show register form
app.get("/register", function(req, res) {
    res.render("register");
})

//sign up logic
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
    res.render("login");
});

//login logic
/**this routes takes username and password from the login form */
app.post("/login", passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//logout route
app.get("/logout", function(req, res) {
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

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});