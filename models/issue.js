var mongoose = require('mongoose');
// ITEM ISSUE SCHEMA
var issueSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    branchName: String,
    receiverName: String,
    date: Date,
    time: String,
    storKeeperSign: String,
    receiverSign: String,
    isApproved: Number
})
module.exports = mongoose.model("Issue", issueSchema);