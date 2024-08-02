const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { collection: 'Test' }); //Saves to testing colelction

module.exports = mongoose.model('Post', postSchema); 
