var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment")

// starter data/seed data
var data =[
    {
        name: "Warm Breeze",
        image: "https://api.creativecommons.engineering/v1/thumbs/51ea6857-e202-4e84-8623-1ee864bcab3c",
        description: "Warm ass breeze dawg."
    },
    {
        name: "Matterhorn's Rest",
        image: "https://api.creativecommons.engineering/v1/thumbs/9f47e988-4c8d-4f4f-8dbd-66af44ff4131",
        description: "Only for the mentally challenged"
    },
    {
        name: "Ascent of Death",
        image: "https://api.creativecommons.engineering/v1/thumbs/8742000b-8f90-44ba-b01a-a571cba71bea",
        description: "For the clinically insane"
    }
]

// loop through data and create a campground for each

function seedDB() {
         //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Removed campgrounds.");
              //Add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Added a campground..");
                        // create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish I had internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment.");
                                }
                            });
                    }
                });
            });
    });
        //Add a few comments
}

module.exports = seedDB;
