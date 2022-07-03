const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose") //plugin that makes making a user and authentication easiar. install passport passport-local and passport-local-mongoose

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose) //adds a passport and username field, but its hidden

module.exports = mongoose.model("User", UserSchema)