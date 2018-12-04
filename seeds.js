var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Beautiful clouds."
    },
    {
        name: "Desert Mesa", 
        image: "http://www.desertcamp.com/images/gallery/dc_units2.jpg",
        description: "Very dry."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Breath-taking canyons."
    },
    { 
        name : "Salmon Creek", 
        image : "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
        description : "Lots of salmons in the river." 
    }
];

function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
         if(err){
             console.log(err);
         }
         console.log("removed all campgrounds");
         // Remove all comments
         Comment.remove({}, function(err) {
             if(err){
                 console.log(err);
             }
             console.log("removed all comments");
              // Add a few campgrounds
             data.forEach(function(seed){
                 Campground.create(seed, function(err, campground){
                     if(err){
                         console.log(err)
                     } else {
                         console.log("added a campground");
                         // Create a comment
                         Comment.create(
                             {
                                 text: "This place is great, but I wish there was internet",
                                 author: "Camp Guy"
                             }, function(err, comment){
                                 if(err){
                                     console.log(err);
                                 } else {
                                     campground.comments.push(comment);
                                     campground.save();
                                     console.log("created a comment");
                                 }
                             });
                     }
                 });
             });
         });
     }); 
     //add a few comments
 }

module.exports = seedDB;