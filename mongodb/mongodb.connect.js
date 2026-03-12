const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(
            "mongodb://localhost:27017/tests"
        );
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:");
        console.error(err);
    }
}

module.exports = { connect };