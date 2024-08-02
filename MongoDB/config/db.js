const mongoose = require('mongoose');

const dbConnect = async (dbName) => {
    const uri = `mongodb+srv://ali:123arv123@cluster0.yukikwg.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=MyMosque`;
    await mongoose.connect(uri); 
}

module.exports = dbConnect;
