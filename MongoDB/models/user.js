const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    mosquesFollowed: [{
        mosqueId: { type: String, required: true }, 
    }],
}, { collection: 'Users' });
// userSchema.index({ username: 1, email: 1 }, { unique: true});

module.exports = mongoose.model('User', userSchema); 
