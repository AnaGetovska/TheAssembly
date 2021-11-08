var mongoose = require('mongoose');

//User Schema
var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    discordId: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    admin: {
        type: Boolean
    }
});

module.exports = mongoose.model('User', UserSchema);