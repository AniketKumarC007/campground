const express =require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync' );
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate')
const flash = require('connect-flash');
// const Campground = require('./models/Campground');
// const Review = require('./models/review');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

//mongoDb connection 
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(() => {
    console.log("Mongo is now connected ");
}).catch(err =>{
    console.log(err);
    console.log("oops didnt connect");
})

app.engine('ejs' , ejsMate);
app.set('view engine' ,'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))) // we should add in our public directory to serve our static assets
// so that we could have images and custom style sheets and Java scripts, JavaScript scripts that we can respond with.
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //f this flag is included on a cookie,  the cookie cannot be accessed through client side scripts. And as a result, even if cross-site scripting, which is really not something we've discussed yet,
        // but even if that flaw exists and a user accidentally accesses a link that exploits this flaw, the browser will not reveal the cookie to a third party.
        // It's just a little extra security thing that we should add in.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expiration date is set till a week  (we dont want that if a user signs in then it should infinitely remain signed in )
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash()) ;
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}) //video no 493 :(
app.get('/' ,(req,res)=>{
    res.render('home');
})
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)
 

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

//Its not gonna hit directly as because we are not handling the async request first .so we will  wrap entire thing in try and catch first 
app.listen(3000, ()=>{
    console.log('Listening on port 3000');
})







// app.get('/campgrounds', catchAsync(async(req,res)=>{
//     const campgrounds = await Campground.find({});
//     // res.send(campgrounds)
//     res.render('campgrounds/index', {campgrounds});
// }))
//always keep id as last or else something like /campground/new , new will be treated as id 
// app.get('/campgrounds/new', (req, res) => {
//     res.render('campgrounds/new');
// })
// app.post('/campgrounds', catchAsync(async (req, res,next) => {
//  if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
//         const campground = new Campground(req.body.campground);
//         await campground.save();
//         res.redirect(`/campgrounds/${campground._id}`)

// }))
// app.get('/campgrounds/:id', async (req, res, next) => {
//    const campground = await Campground.findById(req.params.id).populate('reviews')
//     res.render('campgrounds/show', { campground });
// //    res.send("Ok we r getting somewhere")
// });
// app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id)
//     res.render('campgrounds/edit', { campground });
// }))
// app.put('/campgrounds/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //we have in req body under the section of campground and ... signifies that we have spread the object 
//     res.redirect(`/campgrounds/${campground._id}`)
// }));
// app.get('/makecampground' ,catchAsync(async (req,res)=>{
//     const camp = new Campground({
//         title : 'view Point',
//         description : 'Cheap Camping',
//     })
//     await camp.save();
//     res.send(camp);
// }))
// app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }))
// app.post('/campgrounds/:id/reviews' , async(req,res)=>{
//     // req body looks like { review: { rating: '3', body: 'srtwt' } } cause in the frontend we are submitting like name="review[body]" , so the entire package is wrapped up in review 
// //    console.log(req.params)
// //    console.log(req.body);
//     // res.send("Ok , we made it ") ; 
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// })
// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params; // id represents campground id 
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //$pull use : It removes from an existing array all instances of a value or value that matches a specified condition 
//     //removes review id from that particular campground 
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`);
// }))


// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// }) // will hit for every incoming request