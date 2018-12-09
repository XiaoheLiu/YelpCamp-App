var express = require("express");
var router = express.Router({mergeParams: true});// merge params of the campgrounds and the comments together, so that inside comment routes, we have access to ":id"
var Campground = require("../models/campground.js");
var Comment = require("../models/comment");
var middleware  = require("../middleware");

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    var campground = Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // save comment
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added new comment!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.isOwnerofComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: comment
            });
        }
    });
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.isOwnerofComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req. params.id);
        }
    });
});

// DESTROY ROUTE - delete a comment
router.delete("/:comment_id", middleware.isOwnerofComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;