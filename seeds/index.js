const mongoose = require('mongoose');
const cities = require('./cities');
const Post = require('../models/post');
const { places, descriptors } = require('./seedHelper');
const users = require('./users')
const toronto = require('./torontoLocations')
const images = require("./images")

mongoose.connect('mongodb://localhost:27017/map-app')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Post.deleteMany({})
    for (let i = 0; i < 15; i++) {
        const random1000 = Math.floor(Math.random() * 11);
        const randomImage1 = Math.floor(Math.random() * 60)
        const randomImage2 = Math.floor(Math.random() * 60)
        const post = new Post({
            author: users[random1000],
            location: toronto[i].address,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            images: [images[randomImage1], images[randomImage2]],
            geometry: {
                type: "Point",
                coordinates: [toronto[i].longitude, toronto[i].latitude]
            }
        })
        await post.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})