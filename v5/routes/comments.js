const express = require('express');
const router = express.Router({mergeParams: true});
const Campground  = require("../models/Campground");
const Comment = require('../models/Comment');
const middleware = require('../middleware');


router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (request, response)=> {
    const id = request.params.id;
    Campground.findById(id, (error, campground)=> {
        if (error) {
            console.log(error);
        } else {
            response.render("comments/new", {campground: campground});
        }
    });
    
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (request, response)=> {
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
                    comment.author.id = request.user._id;
                    comment.author.username = request.user.username;
                    comment.save();
                    //connect the new comment to the campground
                    campground.comments.push(comment);
                    campground.save();
                    request.flash("success", "Comment was successfully created.");
                    //redirect to campground show page
                    response.redirect(`/campgrounds/${campground._id}`)
                }
            });
        }
    });
    
});

router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (request, response)=> {
    Comment.findById(request.params.comment_id, (error, result)=> {
        if (error) {
            response.redirect('back');
        } else {
            response.render('comments/edit', {campground_id: request.params.id, comment: result});
            
        }
    });
});

router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (request, response)=> {
    Comment.findByIdAndUpdate(request.params.comment_id, {text: request.body.comment.text}, (error, result)=> {
        if (error) {
            response.redirect('back');
        } else {
            request.flash("success", "Comment was updated");
            response.redirect('/campgrounds/' + request.params.id);
        }
    });
});

router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (request, response)=> {
    Comment.findByIdAndRemove(request.params.comment_id, (error, result)=> {
        if (error) {
            response.redirect("back");
        } else {
            request.flash("success", "Comment was deleted");
            response.redirect(`/campgrounds/${request.params.id}`);
        }
    });
});

module.exports = router;