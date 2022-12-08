const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); // this adds username and password to the model along with additional details like username should be unique 
// This will add a username, a hash and a salt field to store the username, the hash password and the salt value.
//Recap : salt value is a number that defines the time to for decyrpt to work !! also salting means to extend a value to the hasshed password
module.exports = mongoose.model('User', UserSchema);
// 63918568b621100e1f754cc2