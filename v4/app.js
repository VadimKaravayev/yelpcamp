var app         = require("express")(),
    bodyParser  = require("body-parser"),
    mongoose    = require('mongoose'),
    Campground  = require("./models/Campground"),
    Comment     = require("./models/Comment"),
    seedsDB     = require("./seeds");
    
//yelp_camp is the name of a database. If it doesn't exist, mongo creates it automatically.
mongoose.connect("mongodb://localhost/yelp_camp_v4", {useNewUrlParser: true});
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
            response.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    response.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(request, response) {
    const id = request.params.id;
    Campground.findById(id).populate("comments").exec(function(error, foundCampground) {
        if (error) {
            console.log(error);
        } else {
            console.log(foundCampground);
            response.render('campgrounds/show', {campground: foundCampground});        
        }
    });
    
});

//=======================
//COMMENTS ROUTES
//=======================

app.get("/campgrounds/:id/comments/new", function(request, response) {
    const id = request.params.id;
    Campground.findById(id, (error, campground)=> {
        if (error) {
            console.log(error);
        } else {
            response.render("comments/new", {campground: campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments", (request, response)=> {
    //lookup a campground using id
    const id = request.params.id;
    Campground.findById(id, (error, campground)=> {
        if (error) {
            console.log(error);
            response.redirect("/campgrounds");
        } else {
            //create a new comment
            Comment.create(request.body.comment, (error, comment)=> {
                if (error) {
                    console.log(error);
                } else {
                    //connect the new comment to the campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    response.redirect(`/campgrounds/${campground._id}`)
                }
            });
            
            
            
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp v3 server has started.");
});