const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //map module to install @mapbox/mapbox-sdk
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }) // contains forward and reverse geocoding for our addresses


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
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry //storing the mapbox data into our model
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))  //putting images from the request into the campground model as an object
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
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...newImages)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {  //delete from cloudinary
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })  //Make sure to AWAIT THINGS , this pulls images from the array that matches the deleteImages file names from the edit form
    }
    await campground.save()
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