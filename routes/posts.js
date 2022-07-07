const express = require('express');
const router = express.Router(); //no need to install
const catchAsync = require('../utils/catchAsync'); //wraps all our async in a try and catch to handle errors properly
const { isLoggedIn, isAuthor, validatePost } = require("../middleware.js")
const posts = require('../controllers/posts'); // controllers, just helps organize things - all our routing logic is in there
const multer = require('multer') //this is for parsing multipart encoded forms - we can't store images currently with our forms, so we have to add entype="multipart/form-data"
const { storage } = require("../cloudinary")
const upload = multer({ storage }) // this is with multer



router.route('/')
    .get(catchAsync(posts.index))
    .post(isLoggedIn, upload.array('image'), validatePost, catchAsync(posts.createPost)) //image will be under req.files (with s since we have mutiple on the form) and rest of text will be on req.body

router.get('/new', isLoggedIn, posts.renderNewForm)

router.route('/:id')
    .get(catchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePost, catchAsync(posts.updatePost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderEditForm))

module.exports = router