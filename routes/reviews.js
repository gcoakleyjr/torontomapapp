const express = require('express');
const router = express.Router({ mergeParams: true }); //need merge params here because ID from the /campgrounds/:id won't pass to here.

const catchAsync = require('../utils/catchAsync');
const Review = require("../models/review");
const Campground = require('../models/campground');
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware.js")
const reviews = require('../controllers/reviews')

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router