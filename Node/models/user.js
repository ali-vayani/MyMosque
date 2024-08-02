const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    friends: [{
        userId: { type: String, required: true }, // Or ObjectId if storing ObjectIds
        status: { 
            type: String,
            enum: ['Pending', 'Added', 'Incoming'],
            default: 'Pending'
        } 
    }],
    status: {
        type: String, 
        enum: ['Online', 'Away', 'Do Not Disturb'],
        default: 'Online',
        required: false
    },
}, { collection: 'Users' });
// userSchema.index({ username: 1, email: 1 }, { unique: true});

module.exports = mongoose.model('User', userSchema); 
