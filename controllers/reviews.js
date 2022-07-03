const Review = require("../models/review");
const Campground = require('../models/campground');

module.exports.createReview = async (req, res, next) => {
    const review = new Review(req.body.review)
    review.author = req.user._id
    const campground = await Campground.findById(req.params.id)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "Created new review!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // even though we delete the review from the review database, there is still a reference to it here. this $pull removes items from an array that match a property (we use update not delete cause we are just updating the array)
    await Review.findByIdAndDelete(reviewId) //this removes it from the review databose
    req.flash("success", "It's gone!")
    res.redirect(`/campgrounds/${id}`)
}