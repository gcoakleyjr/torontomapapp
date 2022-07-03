const Campground = require('../models/campground');


/****
 * CAMPGROUND INDEX PAGE *
 *****/

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}).populate("author");
    res.render('campgrounds/index', { campgrounds })
}

/****
 * MAKE NEW CAMPGROUND *
 *****/

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id //user._id is automatically added into a req
    await campground.save();
    req.flash("success", "New Campground added!") //add before redirect
    res.redirect(`/campgrounds/${campground._id}`)
}

/****
 * CAMPGROUND PAGE *
 *****/


module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({  //we populate the campground with reviews and author, but each review also has an author, so an object and path populates the reviews author too
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")

    if (!campground) {
        req.flash("error", "Can't find that campground :(")
        return res.redirect("/campgrounds")
    }
    res.render('campgrounds/show', { campground });
}

/****
 * EDIT CAMPGROUND *
 *****/


module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash("error", "Can't find that campground :(")
        return res.redirect("/campgrounds")
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Campground Updated!")
    res.redirect(`/campgrounds/${campground._id}`)
}

/****
 * DELETE CAMPGROUND *
 *****/


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "It's gone!")
    res.redirect('/campgrounds');
}