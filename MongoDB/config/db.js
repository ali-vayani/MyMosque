const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async (dbName) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yukikwg.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=MyMosque`;
    await mongoose.connect(uri); 
}

module.exports = dbConnect;
