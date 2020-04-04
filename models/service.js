var mongoose = require("mongoose")

var serviceSchema = new mongoose.Schema({
    address: String,
    phone: String,
    serviceDate: String,
    serviceTime: String,
    bookingDate:  {type: Date, default: Date.now()}
})

module.exports = mongoose.model("Service",serviceSchema)