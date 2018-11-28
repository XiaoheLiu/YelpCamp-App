var express = require("express");
var request = require("request");
var app = express();
app.set("view enginie", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.listen(3000, function(){
    console.log("Server is listening at port 3000."); 
});