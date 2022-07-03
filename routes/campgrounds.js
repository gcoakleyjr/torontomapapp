const express = require('express');
const router = express.Router(); //no need to install
const catchAsync = require('../utils/catchAsync'); //wraps all our async in a try and catch to handle errors properly
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware.js")


/****
 * CAMPGROUND INDEX PAGE *
 *****/

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({}).populate("author");
    res.render('campgrounds/index', { campgrounds })
}));

/****
 * MAKE NEW CAMPGROUND *
 *****/

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id //user._id is automatically added into a req
    await campground.save();
    req.flash("success", "New Campground added!") //add before redirect
    res.redirect(`/campgrounds/${campground._id}`)
}))

/****
 * CAMPGROUND PAGE *
 *****/

router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("author")
    if (!campground) {
        req.flash("error", "Can't find that campground :(")
        return res.redirect("/campgrounds")
    }
    res.render('campgrounds/show', { campground });
}));

/****
 * EDIT CAMPGROUND *
 *****/

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash("error", "Can't find that campground :(")
        return res.redirect("/campgrounds")
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Campground Updated!")
    res.redirect(`/campgrounds/${campground._id}`)
}));

/****
 * DELETE CAMPGROUND *
 *****/

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "It's gone!")
    res.redirect('/campgrounds');
}));

module.exports = router