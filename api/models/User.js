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
    favorite_repo: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    avatar: {
      type: String,
      unique: true,
      require: false,
      trim: true
    },
    github_id: {
      type: Number, 
      unique: true,
      require: false,
    }
});
var User = mongoose.model('User', UserSchema);
module.exports = User;