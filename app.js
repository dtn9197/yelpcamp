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

 //require routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
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

//set the routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});