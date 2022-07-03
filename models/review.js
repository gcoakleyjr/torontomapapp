const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"  //ref refers to the model. so we have user, review and campground model. when we supply an Object ID, it refers to that model and then we we populate it, we get the actual data
    }
})

module.exports = mongoose.model("Review", reviewSchema)