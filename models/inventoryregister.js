var mongoose = require('mongoose');
// INVENTORY REGISTER SCHEMA
var InventoryRegisterSchema = new mongoose.Schema({
    rcnumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RC"
    },
    quantityRemaining: Number,
    receiverName: String,
    receiverSign: String,
    isApproved: Number
})
module.exports = mongoose.model("InventoryRegister", InventoryRegisterSchema);