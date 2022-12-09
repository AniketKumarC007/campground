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

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
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
});
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

module.exports = mongoose.model('Campground', CampgroundSchema);