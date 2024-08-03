const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    firebaseID: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mosquesFollowed: [{
        type: String,
        required: true
    }],
}, { collection: 'Users' });


module.exports = mongoose.model('User', userSchema); 
