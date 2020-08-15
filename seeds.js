var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment")

// starter data/seed data
var data =[
    {
        name: "Warm Breeze",
        image: "https://api.creativecommons.engineering/v1/thumbs/51ea6857-e202-4e84-8623-1ee864bcab3c",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Dictumst quisque sagittis purus sit amet volutpat. Tellus orci ac auctor augue. Pellentesque dignissim enim sit amet. Adipiscing bibendum est ultricies integer. Arcu non odio euismod lacinia at. Est ante in nibh mauris cursus mattis molestie a iaculis. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Enim blandit volutpat maecenas volutpat. Sagittis orci a scelerisque purus semper eget duis at tellus. Felis donec et odio pellentesque diam volutpat commodo sed egestas. Senectus et netus et malesuada fames."
    },
    {
        name: "Matterhorn's Rest",
        image: "https://api.creativecommons.engineering/v1/thumbs/9f47e988-4c8d-4f4f-8dbd-66af44ff4131",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Dictumst quisque sagittis purus sit amet volutpat. Tellus orci ac auctor augue. Pellentesque dignissim enim sit amet. Adipiscing bibendum est ultricies integer. Arcu non odio euismod lacinia at. Est ante in nibh mauris cursus mattis molestie a iaculis. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Enim blandit volutpat maecenas volutpat. Sagittis orci a scelerisque purus semper eget duis at tellus. Felis donec et odio pellentesque diam volutpat commodo sed egestas. Senectus et netus et malesuada fames."
    },
    {
        name: "Ascent of Death",
        image: "https://api.creativecommons.engineering/v1/thumbs/8742000b-8f90-44ba-b01a-a571cba71bea",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Dictumst quisque sagittis purus sit amet volutpat. Tellus orci ac auctor augue. Pellentesque dignissim enim sit amet. Adipiscing bibendum est ultricies integer. Arcu non odio euismod lacinia at. Est ante in nibh mauris cursus mattis molestie a iaculis. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Enim blandit volutpat maecenas volutpat. Sagittis orci a scelerisque purus semper eget duis at tellus. Felis donec et odio pellentesque diam volutpat commodo sed egestas. Senectus et netus et malesuada fames."
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
