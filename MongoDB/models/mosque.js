const mongoose = require('mongoose');

const mosqueSchema = new mongoose.Schema({
    mosqueName: {
        type: String,
        required: true
    },
    address: {
        type: String, 
        required: true
    },
    info: {
        "address": {
            type: String,
            required: true
        },
        "bio": {
            type: String,
            required: true
        },
        "members": {
            type: Number,
            required: true
        },
    },
    prayerTimes: [{
        fajr: {type: String, required: true},
        dhuhr: {type: String, required: true},
        asr: {type: String, required: true},
        maghrib: {type: String, required: true},
        isha: {type: String, required: true},
        endDate: {type: Date, required: true},
        startDate: {type: Date, required: true}
    }],
    posts: [{ 
        image: {
            type: Boolean,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
    }],
    events: [{
        id: {
            type: Number,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        date: {
            type: String,
            required: true
        }
    }]
    
}, { collection: 'Mosques' });

module.exports = mongoose.model('Mosque', mosqueSchema); 
