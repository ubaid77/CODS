var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    fname: String,
    lname: String,
    password: String,
    services: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service"
            }
        ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",UserSchema)