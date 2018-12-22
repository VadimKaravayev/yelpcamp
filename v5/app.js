const express   = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require('mongoose'),
    Campground  = require("./models/Campground"),
    Comment     = require("./models/Comment"),
    seedsDB     = require("./seeds"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require("./models/User"),
    methodOverride = require('method-override'),
    flash = require("connect-flash");
    
const campgroundRoutes = require('./routes/campgrounds'),
      commentRoutes    = require('./routes/comments'),
      indexRoutes       = require('./routes/index');
    
//yelp_camp is the name of a database. If it doesn't exist, mongo creates it automatically.
mongoose.connect("mongodb://localhost/yelp_camp_v5", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "Kevin Spacey is a gay",
    resave: false,
    saveUninitialized: false 
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((request, response, next)=> {
    response.locals.currentUser = request.user;
    response.locals.warning = request.flash("warning");
    response.locals.success = request.flash("success");
    next();
});

//seedsDB();

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log("YelpCamp v5 server has started.");
});