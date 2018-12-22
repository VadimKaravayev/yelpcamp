var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
        {name: "Salmon Creek", image: "https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144591f2c070a1eeb5_340.jpg"},
        {name: "Granite Hill", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f4c378aeebb6b8_340.jpg"},
        {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f4c378aeebb6b8_340.jpg"}
    ];

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(request, response) {
    
    response.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(request, response) {
    var name = request.body.name;
    var image = request.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    response.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(request, response) {
    response.render("new");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp v1 server has started.");
});