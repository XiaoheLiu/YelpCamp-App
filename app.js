var express = require("express"),
    request = require("request"),
    bodyParser = require("body-parser"),
    app = express();
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Set up Schema
 var campgroundSchema = new mongoose.Schema({
     name: String,
     image: String,
     description: String
 });

 // Create campgrounds collection
 var Campground = mongoose.model("Campground", campgroundSchema);

 // Creat campground entries

//  Campground.create({
//     name: "Granite Hill",
//     image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"
// }, function(err, campground){
//     if (err){
//         console.log(err);
//     } else {
//         console.log(campground);
//     }
// });

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err);
        } else{
            res.render("campgrounds", {campgrounds: campgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name, image: image};
    // campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("Server is listening at port 3000."); 
});