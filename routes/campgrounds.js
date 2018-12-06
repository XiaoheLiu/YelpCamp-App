var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    req.body.campground.author = author;
    Campground.create(req.body.campground, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    // find the campground by ID
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// isLoggedIn middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;