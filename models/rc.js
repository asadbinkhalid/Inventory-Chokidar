var mongoose = require('mongoose');
// RC BOOK SCHEMA
var RCSchema = new mongoose.Schema({
    rcnumber: Number,
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    name: String,
    quantity: Number,
    branchName: String,
    receiverName: String,
    date: Date,
    time: String,
    storKeeperSign: String,
    isApproved: Number
})
module.exports = mongoose.model("RC", RCSchema);