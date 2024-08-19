const express = require('express');
const Mosque = require('../models/mosque')
const router = express.Router();
const dbConnect = require('../config/db');
const mongoose = require('mongoose');
const { findById } = require('../models/user');

// get all mosques
router.get('/', async(req, res) => {
    await dbConnect('MyMosque')
    try {
        const mosques = await Mosque.find();
        res.json(mosques);
    } catch {
        res.status(500).json({message: err.message})
    } finally {
        mongoose.disconnect();
    }
})

/*
* Gets Mosque 
* Inputs: MosqueId
*/
router.get('/getMosque', async(req, res) => {
    await dbConnect('MyMosque');
    try {
        const mosque = await Mosque.findById(req.body.mosqueId)
        res.json(mosque)
    } catch {
        res.status(500).json({message: err.message})
    } finally {
        mongoose.disconnect();
    }
})

/*
* Gets Mosque Posts
* Inputs: MosqueId
*/
router.get('/getPosts', async(req, res) => {
    await dbConnect('MyMosque');
    try {
        const mosque = await Mosque.findById(req.body.mosqueId)
        res.json(mosque.posts)
    } catch {
        res.status(500).json({message: err.message})
    } finally {
        mongoose.disconnect();
    }
})

/*
* Creates Post
* Inputs: postInfo, mosqueId
*/
router.post('/post', async (req, res) => {
    await dbConnect('MyMosque')

    try {
        const mosquePost = await Mosque.findByIdAndUpdate(
            req.body.mosqueId, 
            { $push: { posts: req.body.postInfo }}, 
            { new: true }
        );

        if (!mosquePost) {
            return res.status(404).json({ message: "Mosque not found" });
        }

        console.log("mosque post: ", mosquePost);
        res.status(201).json(mosquePost);
    } catch (err) {
        console.error("Error updating prayers:", err);
        res.status(400).json({ message: err.message });
    } finally {
        mongoose.disconnect();
    }
})

/*
* Creates Mosque
* Inputs: username, address, prayer times
*/
router.post('/create', async (req, res) => {
    await dbConnect('MyMosque')

    const newMosque = new Mosque({
        mosqueName: req.body.mosqueName,
        address: req.body.address,
        prayerTimes: req.body.prayerTimes
    })
    
    try {
        const savedMosque = await newMosque.save();
        res.status(201).json(savedMosque);
    } catch {
        res.status(400).json({message: err.message})
    } finally {
        mongoose.disconnect();
    }
})

/*
* Updates Mosque Prayer Times
* Inputs: MosqueID, new prayer times
*/
router.post('/updatePrayers', async (req, res) => {
    await dbConnect('MyMosque');
    try {
        const updatedMosque = await Mosque.findByIdAndUpdate(
            req.body.mosqueId, 
            { $set: { prayerTimes: req.body.prayerTimes }}, 
            { new: true }
        );

        if (!updatedMosque) {
            return res.status(404).json({ message: "Mosque not found" });
        }

        console.log("Updated mosque: ", updatedMosque);
        res.status(201).json(updatedMosque);
    } catch (err) {
        console.error("Error updating prayers:", err);
        res.status(400).json({ message: err.message });
    } finally {
        mongoose.disconnect();
    }
});

module.exports = router;
