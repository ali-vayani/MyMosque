const express = require('express');
const User = require('../models/user'); 
const router = express.Router();
const dbConnect = require('../config/db');
const mongoose = require('mongoose');


// Get all friends
router.get('/', async (req, res) => {
    await dbConnect('DiscordCloneApp')
    try {
        const usersFriends = await User.findById(req.query.userId).populate('friends'); 
        res.json(usersFriends['friends']); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); // Send error response
    } finally {
       mongoose.disconnect(); // Disconnect after the operation 
    }
});

router.post('/add', async (req, res) => {
    await dbConnect('DiscordCloneApp')
    try {

        // adding pending friend to friends list
        const updatedUser = await User.findByIdAndUpdate(
            req.body.userId, 
            { $push: { friends: { userId: req.body.friendId, status: 'Pending' }} },
            { new: true }
        ); 
        
        const updatedFriend = await User.findByIdAndUpdate(
            req.body.friendId, 
            { $push: { friends: { userId: req.body.userId, status: 'Incoming' }} },
            { new: true }
        );


        res.status(201).json({ message: "Friend added!" }); // Or send back results 
    } catch (err) {
        res.status(400).json({ message: err.message }); 
    } finally {
        mongoose.disconnect()
    }
});

router.post('/accept', async (req, res) => {
    await dbConnect("DiscordCloneApp");
    try {
        const { userId, friendId } = req.body;

        // 1. Update 'User'  who accepted:
        const resultA = await User.findOneAndUpdate(
            { _id: userId, 'friends.userId': friendId }, // Find the right friend subdocument 
            { $set: { 'friends.$.status': 'Added' }}, // Update status to 'Added'
            { new: true }
        );  

        // 2. Update the 'friend' who sent the request:
        const resultB = await User.findOneAndUpdate(
            { _id: friendId, 'friends.userId': userId },
            { $set: { 'friends.$.status': 'Added' }},
            { new: true }
        ); 

        // 3. Handle success or potential errors
        if (resultA && resultB) { 
            res.status(200).json({ message: "Friend request accepted!" });
        } else {
            res.status(404).json({ message: "User or friend request not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    } finally {
        mongoose.disconnect();
    }
});

router.post('/remove', async (req, res) => {
    await dbConnect("DiscordCloneApp");
    try {
        const { userId, friendId } = req.body;

        // 1. Remove from 'userId' document
        const resultA = await User.findByIdAndUpdate(
            userId, 
            { $pull: { friends: { userId: friendId }}},  // Remove using $pull
            { new: true }
        );

        // 2. Remove from 'friendId' document
        const resultB = await User.findByIdAndUpdate(
            friendId, 
            { $pull: { friends: { userId: userId }}},
            { new: true }
        ); 

        // 3. Handle success, errors
        if (resultA && resultB) { 
            res.status(200).json({ message: "Friend removed!" });
        } else {
            res.status(404).json({ message: "User or friend not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    } finally {
        mongoose.disconnect();
    }
});


module.exports = router;