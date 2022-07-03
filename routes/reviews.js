const express = require('express');
const router = express.Router({ mergeParams: true }); //need merge params here because ID from the /campgrounds/:id won't pass to here.

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require("../models/review");
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js")


router.post("/", validateReview, catchAsync(async (req, res, next) => {
    const review = new Review(req.body.review)
    const campground = await Campground.findById(req.params.id)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "Created new review!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) // even though we delete the review from the review database, there is still a reference to it here. this $pull removes items from an array that match a property (we use update not delete cause we are just updating the array)
    await Review.findByIdAndDelete(reviewId) //this removes it from the review databose
    req.flash("success", "It's gone!")
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router