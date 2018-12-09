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

// NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
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

// EDIT - edit form to change campground
router.get("/:id/edit", isOwnerofCampground, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});       
    });  
});

// UPDATE - post request to change campground
router.put("/:id", isOwnerofCampground, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY - delete a campground
router.delete("/:id", isOwnerofCampground, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// middleware: check if user is logged in
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// middleware: check if user owns the campground
function isOwnerofCampground(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.send("You do not have the permission to edit the campground.");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}
module.exports = router;