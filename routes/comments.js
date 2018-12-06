var express = require("express");
var router = express.Router({mergeParams: true});// merge params of the campgrounds and the comments together, so that inside comment routes, we have access to ":id"
var Campground = require("../models/campground.js");
var Comment = require("../models/comment");

// NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
    var campground = Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
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