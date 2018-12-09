var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// INDEX ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

// AUTH ROUTES  
// show register form
router.get("/register", function(req, res){
    res.render("userAuth/register");
});

// sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message + ".");
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Thanks for joining Yelpcamp, " + user.username + "!");
            res.redirect('/campgrounds');
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("userAuth/login", {message: req.flash("error")});
});

// login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;