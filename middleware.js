const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js'); //the Joi validator
const Campground = require('./models/campground');
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl //saves a cookie(session actually) that holds the path we are going to before being redirected
        req.flash("error", "You must be signed in")
        return res.redirect("/login") //use return or it still may run the other redirect
    }
    next() //always do the next or it breaks
}

module.exports.isAuthor = async (req, res, next) => {  //this is so if they try to send a request through postman, even though or delete button is hidden
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {  //find the campground, look at the other key and check it to req.user which is always sent on requests and its ID
        req.flash("error", "Not authorized")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Not authorized")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {  //put this in front of our route function to validate the forms we are submitting on the client side
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {  //put this in front of our route function to validate the forms we are submitting
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}