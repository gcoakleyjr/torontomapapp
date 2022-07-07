const Review = require("../models/review");
const Post = require('../models/post');

module.exports.createReview = async (req, res, next) => {
    const review = new Review(req.body.review)
    review.author = req.user._id
    const post = await Post.findById(req.params.id)
    post.reviews.push(review)
    await review.save()
    await post.save()
    req.flash("success", "Created new review!")
    res.redirect(`/posts/${post._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // even though we delete the review from the review database, there is still a reference to it here. this $pull removes items from an array that match a property (we use update not delete cause we are just updating the array)
    await Review.findByIdAndDelete(reviewId) //this removes it from the review databose
    req.flash("success", "It's gone!")
    res.redirect(`/posts/${id}`)
}