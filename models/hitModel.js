const mongoose = require("mongoose");



const hitSchema = new mongoose.Schema({
    hit:Number,
    identity: String,
    timestamp: Date
});


const hitModel = mongoose.model('Analytics',hitSchema)

module.exports = hitModel;