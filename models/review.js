const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    // rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"  //ref refers to the model. so we have user, review and post model. when we supply an Object ID, it refers to that model and then we we populate it, we get the actual data
    },
    replies: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Review' 
    }]
})

const Review = mongoose.model("Review", reviewSchema)

reviewSchema.post('findOneAndDelete', async function (doc) { //this allows us to delete all the reviews along with the Post. findOneAndDelete is a middleware that is called whenever you use mongoose findByIdandDelete and the post method is what happens ..post schema update i think
    if (doc) { // doc is the Post we are deleting
        await Review.deleteMany({
            _id: {
                $in: doc.reviews //the in means, find all within this field 
            }
        })
    }
})

module.exports = Review