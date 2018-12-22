const Campground = require('../models/Campground'),
      Comment = require('../models/Comment');

const middleware = {};

middleware.isLoggedIn = function(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    request.flash("warning", "You need to be logged in.");
    response.redirect('/login');
};

middleware.checkOwnership = function(request, response, next) {
    if (request.isAuthenticated()) {
        Campground.findById(request.params.id, (error, theResult)=> {
            if (error) {
                request.flash("warning", "Error occured");
                console.log(error);
                response.redirect('/campgrounds');
            } else {
                if (theResult.author.id.equals(request.user._id)) {
                    next();
                } else {
                    request.flash("warning", "You do not have permission.");
                    response.redirect("back");
                }
            }
        });
    } else {
        request.flash("warning", "You need to be logged in.");
        response.redirect("back");
    }
}

middleware.checkCommentOwnership = function(request, response, next) {
    if (request.isAuthenticated()) {
        Comment.findById(request.params.comment_id, (error, foundComment)=> {
        if (error) {
            request.flash("warning", "Error occured");
            response.redirect('back');
        } else {
            if (foundComment.author.id.equals(request.user._id)) {
                next();
            } else {
                request.flash("warning", "You do not have permission.");
                response.redirect("back");
            }
        }
    });
    } else {
        request.flash("warning", "You need to be logged in.");
        response.redirect('back');
    }
}

module.exports = middleware;