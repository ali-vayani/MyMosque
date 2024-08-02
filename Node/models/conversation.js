const mongoose = require('mongoose');

const convoSchema = new mongoose.Schema({
    users: {
        type: [String],
        required: true,
        unique: true
    },
    messages: {
        type: [Object],
        default: [],
        required: false
    },
}, { collection: 'Conversations' });

module.exports = mongoose.model('Conversation', convoSchema); 
