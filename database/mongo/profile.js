const mongoose = require('mongoose');

const schema = mongoose.Schema({

    userID: String,
    color: String,
    shortDesc: String,
    createdAt: Number

});

module.exports = mongoose.model('profile', schema);