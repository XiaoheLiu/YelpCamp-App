var express         = require("express"),
    app             = express();
    request         = require("request"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    moment          = require("moment"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user")
    seedDB          = require("./seeds");

// Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),  
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

var port = process.env.PORT || 3000;

// ===== App CONFIG =====
// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true});
mongoose.connect("mongodb://athenaliu:yelpcamp2018@ds123664.mlab.com:23664/yelpcampdatabase", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
// seedDB();

// ===== Passport CONFIG =====
app.use(require("express-session")({
    secret: "Best web app ever made!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.moment = moment;
    next();
}); // pass "currentUser: req.user" as local var to every route

// ===== Routes =====
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
// Visiting any other route
app.get("*", function(req, res){
    req.flash("error", "Sorry, page not found.")
    res.render("landing"); 
  });

// Start Server
app.listen(port, function(err, res){
    if (err){
        console.log("Server error.");
    } else {
        console.log("Server is listening at port " + port + "."); 
    }    
});