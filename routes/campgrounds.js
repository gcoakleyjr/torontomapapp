const express = require('express');
const router = express.Router(); //no need to install
const catchAsync = require('../utils/catchAsync'); //wraps all our async in a try and catch to handle errors properly
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware.js")
const campgrounds = require('../controllers/campgrounds'); // controllers, just helps organize things - all our routing logic is in there
const multer = require('multer') //this is for parsing multipart encoded forms - we can't store images currently with our forms, so we have to add entype="multipart/form-data"
const { storage } = require("../cloudinary")
const upload = multer({ storage }) // this is with multer



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)) //image will be under req.files (with s since we have mutiple on the form) and rest of text will be on req.body

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router