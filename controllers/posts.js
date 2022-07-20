const Post = require('../models/post');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //map module to install @mapbox/mapbox-sdk
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }) // contains forward and reverse geocoding for our addresses


/****
 * POST INDEX PAGE *
 *****/

module.exports.index = async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.render('posts/index', { posts })
}

/****
 * MAKE NEW post *
 *****/

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new');
}

module.exports.createPost = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.post.location,
        limit: 1,
    }).send()
    const post = new Post(req.body.post);
    post.geometry = geoData.body.features[0].geometry //storing the mapbox data into our model
    post.images = req.files.map(f => ({ url: f.path, filename: f.filename }))  //putting images from the request into the post model as an object
    post.author = req.user._id //user._id is automatically added into a req
    await post.save();
    req.flash("success", "New Post added!") //add before redirect
    res.redirect(`/posts/${post._id}`)
}

/****
 * post PAGE *
 *****/


module.exports.showPost = async (req, res,) => {
    const post = await Post.findById(req.params.id).populate({  //we populate the post with reviews and author, but each review also has an author, so an object and path populates the reviews author too
            path: "reviews",
            populate: [{
                path: "author",
                select: ["username"]
            },{
                path: "replies",
                populate: {
                    path: "author",
                    select: ["username"]
                }
            }]
        }).populate("author")

    if (!post) {
        req.flash("error", "Can't find that post :(")
        return res.redirect("/posts")
    }
    res.render('posts/show', { post });
}

/****
 * LIKE post *
 *****/
 module.exports.likePost = async (req, res,) => {
    const { id } = req.params
    const post = await Post.findById(id)

    if (post.likedBy.includes(req.user._id)) {
        await Post.findByIdAndUpdate(id, {$pull: { likedBy: req.user._id }})      
    } else {
        post.likedBy.push(req.user._id)   
        await post.save()
    }
    
    res.redirect(`/posts/${id}`)

 }

/****
 * EDIT post *
 *****/


module.exports.renderEditForm = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        req.flash("error", "Can't find that post :(")
        return res.redirect("/posts")
    }
    res.render('posts/edit', { post });
}

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }))
    post.images.push(...newImages)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {  //delete from cloudinary
            await cloudinary.uploader.destroy(filename)
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })  //Make sure to AWAIT THINGS , this pulls images from the array that matches the deleteImages file names from the edit form
    }
    await post.save()
    req.flash("success", "Post Updated!")
    res.redirect(`/posts/${post._id}`)
}

/****
 * DELETE post *
 *****/


module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success", "It's gone!")
    res.redirect('/posts');
}