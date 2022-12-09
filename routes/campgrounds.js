const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary");
const { isLoggedIn, isAuthor } = require('../middleware');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//story of multer :
//First set the enctype="multipart/form-data".
//As unfortunately  we can't parse the body the regular way we had been doing it while uploading images So then we need to make sure 
//that we use Multer, and then Multer plays well with cloud injury, so we pass that form information, we send that on up to Cloud Ordinary, we get back URLs, those URLs as well as other information about each upload.
// Well, as we saw, we get more information back and that information is going to be added on to a particular property on the request object called request files, which we then had access to.
// And we were able to take the information from request files and use it to update our particular model instance and save that.
// And then in our template we have access to URL and file name for each image and we just render the URL
const Campground = require('../models/campground');

// const validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


router.post('/', isLoggedIn, upload.array('image'),  catchAsync(async (req, res, next) => { // upload.array('image') multer middleware 
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); //req.files thanks to multer , cloudinary-multer
    campground.author = req.user._id;
    //req.user , thanks to passport 
    await campground.save();
    // console.log(campground) ;
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); //We are saying populate all the reviews from the reviews array on the one campground that we r finding , then populate on each one of them their author , and then separately populate the one author on this campground
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor ,catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn,isAuthor,upload.array('image'), catchAsync(async (req, res) => {
    // const { id } = req.params;
    // const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // req.flash('success', 'Successfully updated campground!');
    // res.redirect(`/campgrounds/${campground._id}`)
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // to remove from the cloudinary base 
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const catchAsync = require('../utils/catchAsync');
// // const { campgroundSchema } = require('../schemas.js');

// const ExpressError = require('../utils/ExpressError');
// const Campground = require('../models/campground');
// const { isLoggedIn } = require('../middleware');

// router.get('/', async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds })
// });

// router.get('/new', isLoggedIn, (req, res) => {
//     res.render('campgrounds/new');
// })


// router.post('/', isLoggedIn , async (req, res, next) => {
//     // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     req.flash('success', 'Successfully made a new campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// })

// router.get('/:id', async (req, res,) => {
//     const campground = await Campground.findById(req.params.id).populate('reviews');
//     if (!campground) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/show', { campground });
// });

// router.get('/:id/edit',async (req, res) => {
//     const campground = await Campground.findById(req.params.id)
//     if (!campground) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/edit', { campground });
// })

// router.put('/:id',async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//     req.flash('success', 'Successfully updated campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// });

// router.delete('/:id',async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash('success', 'Successfully deleted campground')
//     res.redirect('/campgrounds');
// });

// module.exports = router;
