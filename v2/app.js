var app         = require("express")(),
    bodyParser  = require("body-parser"),
    mongoose    = require('mongoose');
    
//yelp_camp is the name of a database. If it doesn't exist, mongo creates it automatically.
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
// Campground.create({
//     name: "Mountain Goat's Rest", 
//     image: "https://pixabay.com/get/e83db7072ef6053ed1584d05fb1d4e97e07ee3d21cac104491f4c279a0e5b4be_340.jpg",
//     description: "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. "
// }, function(err, capmground) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND");
//         console.log(capmground);
//     }
// });

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
    Campground.findById(id, function(error, foundCampground) {
        if (error) {
            console.log(error);
        } else {
            response.render('show', {campground: foundCampground});        
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp v2 server has started.");
});