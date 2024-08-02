const express = require('express');
const User = require('../models/user'); 
const router = express.Router();
const dbConnect = require('../config/db');
const mongoose = require('mongoose');


// Get all users
router.get('/', async (req, res) => {
    await dbConnect('DiscordCloneApp')
    try {
        const users = await User.find(); 
        res.json(users);
    } catch (err) { 
        res.status(500).json({ message: err.message }); // Send error response
    } finally {
       mongoose.disconnect(); // Disconnect after the operation 
    }
});

router.post('/create', async (req, res) => {
    await dbConnect('DiscordCloneApp')
    // creates user and adds to db
    const newUser = new User({
        userName: req.body.userName,
    });
    try {
        // sends to DB
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        mongoose.disconnect(); // Disconnect after the operation 
    }
});
router.post('/updateStatus', async (req, res) => {
    await dbConnect('DiscordCloneApp')
    try {
        User.findByIdAndUpdate(
            req.body.userId,  // The _id of the document
            { $set: { status: req.body.userStatus } }, // Update operator
            { new: true }
        )
        .then(updatedUser => {
            console.log("Updated user:", updatedUser);
            res.status(201).json(updatedUser);
        })
        .catch(err => console.error("Error updating user:", err));
    } catch {
        res.status(400).json({ message: err.message });
    } finally {
        //mongoose.disconnect();
    }
})
router.post('/addFriend', async(req, res) => {
    await dbConnect('DiscordCloneApp');
    try {
        User.findByIdAndUpdate(
            req.body.userId, 
            { $push: { friends: req.body.friendId } },
            { new: true}
        ).then(updatedUser => {
            console.log("Updated user:", updatedUser);
            res.status(201).json(updatedUser);
        }).catch(err => console.error("Error updating user:", err));
    } catch {
        res.status(400).json({message: err.message})
    }
})

module.exports = router;
