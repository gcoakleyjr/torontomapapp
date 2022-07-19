const mongoose = require("mongoose")
const Review = require("./review")
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})


const opts = { toJSON: { virtuals: true }, timestamps: true }; // need thise for maps. Options for virtual to be converted to JSON when we pass it to javascript through script in our ejs


ImageSchema.virtual("thumbnail").get(function () { //makes a method or property for a model
    return this.url.replace("/upload", "/upload/w_200")
})

ImageSchema.virtual("showPageUrl").get(function () { //makes a method or property for a model
    return this.url.replace("/upload", "/upload/c_fill,h_500,w_500")
})




const PostSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"  //ref refers to the model. so we have user, review and Post model. when we supply an Object ID, it refers to that model and then we we populate it, we get the actual data
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts)

PostSchema.virtual("properties.popUpMarkup").get(function() { 
    return  `
    <strong><a href="/posts/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 30)}...</p>`
})

PostSchema.virtual("daysFromCreation").get(function() { 
    const createdDate = new Date(this.createdAt)  
    const currentDate = new Date()
    const oneDay = 1000 * 60 * 60 * 24

    const diffInTime = currentDate.getTime() - createdDate.getTime()
    return Math.round(diffInTime / oneDay)
})

PostSchema.post('findOneAndDelete', async function (doc) { //this allows us to delete all the reviews along with the Post. findOneAndDelete is a middleware that is called whenever you use mongoose findByIdandDelete and the post method is what happens ..post schema update i think
    if (doc) { // doc is the Post we are deleting
        await Review.deleteMany({
            _id: {
                $in: doc.reviews //the in means, find all within this field 
            }
        })
    }
})

module.exports = mongoose.model("Post", PostSchema)