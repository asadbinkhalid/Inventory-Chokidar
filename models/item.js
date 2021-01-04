var mongoose = require('mongoose');

// ITEM SCHEMA
var itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    vendorName: String,
    invoiceNo: Number,
    itemType: String
})
module.exports = mongoose.model("Item", itemSchema);