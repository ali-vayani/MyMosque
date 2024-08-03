const express = require('express');
const User = require('../models/user'); 
const router = express.Router();
const dbConnect = require('../config/db');
const mongoose = require('mongoose');


// Get all users
router.get('/', async (req, res) => {
    await dbConnect('MyMosque')
    try {
        const users = await User.find(); 
        res.json(users);
    } catch (err) { 
        res.status(500).json({ message: err.message }); // Send error response
    } finally {
       mongoose.disconnect(); // Disconnect after the operation 
    }
});

/*
* Gets User
* Inputs: userId
*/
router.get('/getUser', async(req, res) => {
    await dbConnect('MyMosque');
    try {
        const user = await User.findById(req.body.userId)
        res.json(user)
    } catch {
        res.status(500).json({message: err.message})
    } finally {
        mongoose.disconnect();
    }
})

/*
* Creates User
* Inputs: username, firebaseID, email
*/
router.post('/create', async (req, res) => {
    await dbConnect('MyMosque')
    // creates user and adds to db
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firebaseID: req.body.firebaseID,
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


/*
* Adds Mosque To User's Follow List
* Inputs: uid & mosque id
*/
router.post('/addMosque', async(req, res) => {
    await dbConnect('MyMosque');
    try {
        User.findByIdAndUpdate(
            req.body.userId, // Find the right conversation
            { $push: { mosquesFollowed: req.body.mosqueId}}, // Add to 'messages'
            { new: true } // Return the updated document
        ).then(updatedUser => {
            console.log("Updated user:", updatedUser);
            res.status(201).json(updatedUser);
        }).catch(err => console.error("Error updating user:", err));
    } catch {
        res.status(400).json({message: err.message})
    } finally {
        mongoose.disconnect();
    }
})

module.exports = router;
