const mongoose = require("mongoose");
require('dotenv').config(); 

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log("DB Connected Successfully...");
    } catch (error) {
        console.error("DB Connection Failed:", error);
    }
};

module.exports = dbConnect;
