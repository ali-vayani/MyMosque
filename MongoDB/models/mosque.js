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
    prayerTimes: [{
        fajr: {type: String, required: true},
        dhuhr: {type: String, required: true},
        asr: {type: String, required: true},
        maghrib: {type: String, required: true},
        isha: {type: String, required: true},
        endDate: {type: Date, required: true}
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
            type: Date,
            required: true
        },
        likes: {
            type: Number,
            required: true
        }
    }]
}, { collection: 'Mosques' });

module.exports = mongoose.model('Mosque', mosqueSchema); 
