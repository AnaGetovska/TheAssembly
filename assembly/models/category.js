var mongoose = require('mongoose');

// Category Schema
var CategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    image: {
        type: String
    },
    featured: {
        type: Boolean
    }
});

module.exports = mongoose.model('Category', CategorySchema);