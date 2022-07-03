const mongoose = require("mongoose")
const Review = require("./review")
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"  //ref refers to the model. so we have user, review and campground model. when we supply an Object ID, it refers to that model and then we we populate it, we get the actual data
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) { //this allows us to delete all the reviews along with the campground. findOneAndDelete is a middleware that is called whenever you use mongoose findByIdandDelete and the post method is what happens ..post schema update i think
    if (doc) { // doc is the campground we are deleting
        await Review.deleteMany({
            _id: {
                $in: doc.reviews //the in means, find all within this field 
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema)