const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    _id: String,
    username: {
        type: String,
        required: true,
    },
    // firebaseID: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mosquesFollowed: [{
        type: String,
        required: true
    }, { _id: false }],
}, { collection: 'Users' });


module.exports = mongoose.model('User', userSchema); 
