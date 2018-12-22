const mongoose   = require("mongoose"),
      Campground = require("./models/Campground"),
      Comment    = require("./models/Comment");
      
let data = [{
    name: "Cloud's Rest",
    image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    description: "Tristique ut luctus amet Nam non a consequat dis mattis magna. Vehicula cubilia ligula porta eu mus primis mattis nisl class urna proin mauris tempor pulvinar sagittis congue pretium platea habitant amet faucibus sodales class facilisi pulvinar, nec tempus est parturient duis non primis. Mus sociis Arcu ridiculus porttitor. Ullamcorper."
}, {
    name: "Desert Mesa",
    image: "https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    description: "Feugiat. Facilisi hymenaeos hymenaeos ornare congue mus integer scelerisque. Ultrices tristique proin ac tortor dictum phasellus orci, semper Facilisis sapien. Curabitur ultrices auctor vulputate viverra leo, suscipit. Mollis viverra pede ante taciti congue aenean nisl cum accumsan sed aenean tristique egestas dis nisl fermentum netus magna torquent vivamus euismod duis."
}, {
    name: "Canyon Floor",
    image: "https://images.unsplash.com/photo-1533575770077-052fa2c609fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    description: "Faucibus consequat phasellus, cubilia urna Sollicitudin ultricies scelerisque eros risus magna. Tellus vitae libero, libero semper neque accumsan consectetuer, quam dictum curabitur posuere nostra potenti nonummy pulvinar suscipit. Tempus. Cubilia hendrerit erat auctor lorem. Vulputate risus blandit sit urna quisque parturient quisque tincidunt odio vivamus proin donec blandit varius vehicula."
}];
      
function seedDB() {
    Campground.deleteMany({}, function(error) {
        if (error) {
            console.log(error);
        }
        console.log("Campgrounds removed.");
        
        data.forEach(seed=> {
            Campground.create(seed, (error, campground)=> {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Added " + campground.name);
                    Comment.create({
                        text: "Maecenas nibh interdum pede suscipit, in nunc. Justo iaculis vitae.",
                        author: "Homer"
                    }, (error, comment)=> {
                        if (error) {
                            console.log(error);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a new comment");
                        }
                    });
                }
            });    
        });
    });
    
    
}

module.exports = seedDB;