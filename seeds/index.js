const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(() => {
    console.log("Mongo is now connected ");
}).catch(err =>{
    console.log(err);
    console.log("oops didnt connect");
})

const db = mongoose.connection;

//To Pick Random array element
const rand = (array)=>{
    return  array[Math.floor(Math.random() * array.length)];
}
//console.log(rand(places));

const seedDB = async()=>{
    await Campground.deleteMany({}).then(()=>{
        console.log('everyhting is cleared');
    }); //clears everyhting in the database
    for(let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*1000) +1000;
        const camp =  new Campground({
            author :'63918568b621100e1f754cc2',
            location :`${cities[random1000].city},${cities[random1000].state}`,
           title : `${rand(descriptors)} ${rand(places)}`,
           image : 'https://source.unsplash.com/collection/483251',
           description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price : price
        })
       await camp.save();

    }

}
seedDB().then(()=>{
    mongoose.connection.close();
});

