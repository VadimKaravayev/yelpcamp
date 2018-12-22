const express = require('express');
const router = express.Router();
const Campground  = require("../models/Campground");
const middleware =require('../middleware');

router.get("/campgrounds", (request, response)=> {
    Campground.find({}, (error, allCampgrounds)=> {
        if (error) {
            console.log(error);
        } else {
            response.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post('/campgrounds', middleware.isLoggedIn, (request, response)=> {
    const newCampground = {
        name: request.body.name,
        price: request.body.price,
        image: request.body.image, 
        description: request.body.description,
        author: {
            id: request.user._id,
            username: request.user.username
        }
    };
    Campground.create(newCampground, (error, newlyCreated)=> {
        if (error) {
            console.log(error);
        } else {
            request.flash("success", newlyCreated.name + " was created.");
            response.redirect("/campgrounds");
        }
    });
});

router.get('/campgrounds/new', middleware.isLoggedIn, (request, response)=> {
    response.render("campgrounds/new");
});

router.get('/campgrounds/:id', (request, response)=> {
    Campground
        .findById(request.params.id)
        .populate("comments")
        .exec((error, foundCampground)=> {
            if (error) {
                console.log(error);
            } else {
                response.render(
                    'campgrounds/show', 
                    {campground: foundCampground});        
            }
        });
});

//EDIT
router.get('/campgrounds/:id/edit', middleware.checkOwnership, (request, response)=> {
    Campground.findById(request.params.id, (error, result)=> {
        response.render('campgrounds/edit', {campground: result});
    })
});

//UPDATE findOneAndUpdate | findByIdAndUpdate
router.put('/campgrounds/:id', middleware.checkOwnership, (request, response)=> {
    const id = request.params.id;
    Campground.findByIdAndUpdate(id, request.body.campground, (error, result)=> {
        if (error) {
            console.log(error);
            response.redirect('/campgrounds');
        } else {
            request.flash("success", "Successfully edited.");
            response.redirect(`/campgrounds/${id}`);
        }
    });
});

router.delete('/campgrounds/:id', middleware.checkOwnership, (request, response)=> {
    Campground.findByIdAndRemove(request.params.id, (error, result)=> {
        if (error) {
            console.log(error);
        }
        request.flash("success", result.name + " was deleted");
        response.redirect('/campgrounds');
    });
});

module.exports = router;