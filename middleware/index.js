var Campground = require("../models/campground.js"),
    Comment = require("../models/comment.js");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

middlewareObj.isOwnerofCampground = function (req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Oops, campground not found.")
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Oops, you don't have the permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first.");
        res.redirect("back");
    }
}

middlewareObj.isOwnerofComment = function (req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Oops, you don't have the permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first.");
        res.redirect("back");
    }
}

module.exports = middlewareObj;