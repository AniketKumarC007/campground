const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});
//for tranforming the images into the thumbnails 
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
//So to tackle it ,  we need to set this option here to JSON virtual true and pass this to our schema
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
// You can't get mongoose virtual to be part of the result object. it says By default, Mongoose does not include virtual when you convert a document to JSON.



//findOneAndDelete middleware will be running when in the backend it will hitting findByIdAndDelete
CampgroundSchema.post('findOneAndDelete', async function (doc) { //post middleware have the access of campground while pre doesnt 
   //Here doc contains that campground which is going to be deleted 
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews //// those in campground review delete them all
            }
        })
    }
})
//first compile then export 
//mapbox returns us geo json and we need to follow this geo JSON pattern if we want to use some of these operators later on.
// {"type  : point " , "coordinates" :[-9,0 ,2.3]}
module.exports = mongoose.model('Campground', CampgroundSchema);