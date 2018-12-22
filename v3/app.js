var app         = require("express")(),
    bodyParser  = require("body-parser"),
    mongoose    = require('mongoose'),
    Campground  = require("./models/Campground"),
    seedsDB     = require("./seeds");
    
//yelp_camp is the name of a database. If it doesn't exist, mongo creates it automatically.
mongoose.connect("mongodb://localhost/yelp_camp_v3", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


seedsDB();

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(request, response) {
    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log(error);
        } else {
            response.render("index", {campgrounds: allCampgrounds});
        }
    });
    
    
});

app.post("/campgrounds", function(request, response) {
    var name = request.body.name;
    var image = request.body.image;
    var description = request.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(error, newlyCreated) {
        if (error) {
            console.log(error);
        } else {
            response.redirect("/campgrounds");
        }
    });
    
});

app.get("/campgrounds/new", function(request, response) {
    response.render("new");
});

app.get("/campgrounds/:id", function(request, response) {
    const id = request.params.id;
    Campground.findById(id).populate("comments").exec(function(error, foundCampground) {
        if (error) {
            console.log(error);
        } else {
            console.log(foundCampground);
            response.render('show', {campground: foundCampground});        
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp v3 server has started.");
});