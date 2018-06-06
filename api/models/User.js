var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
    access_token: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    favorite: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },

});
var User = mongoose.model('User', UserSchema);
module.exports = User;