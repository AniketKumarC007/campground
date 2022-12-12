# Campgrounds
Campgrounds is inspired from yelp.com. It is a web Application in which users can perform CRUD operations on Campground and can review them as well. 
A map has also been displayed for better searching.

## Specifications
   - Authentication
     - User can register and login
     - Used Passport for that purpose
   - Authorization
     - User needs to be logged in to make any change(add,update or delete)
     - A user can only alter his posts or reviews
   - Functionalities
     - Campgrounds are marked on a cluster map using Mapbox API
     - Client side and server side validations are done
     - Images of campgrounds are uploaded to Cloudinary
     - Images can be added and deleted after creation of Campground
     - CRUD functions have been implemented on Campgrounds
     - Flash messages were displayed
     - Sessions and cookies were used
     - Every Campground has it's location displayed seperately on a map
## Built with
   - ### Front End
     - HTML, CSS, Bootsrap v5.0
     - EJS, EJS Mate
  - ### Back End
     - NodeJS
     - ExpressJS
     - MongoDB
     - cloudinary
     - MapBox
     - passport(local-strategy)
     - connect-flash
     - sessions


    
