const mongoose = require('mongoose');

const prayerTimeSettingSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
});

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    prayerTimeSettings: {
        type: [prayerTimeSettingSchema],
        required: true,
    }
}, {collection: 'Users'});

// const User = mongoose.model('Users', userSchema);

module.exports = mongoose.model('User', userSchema); 
