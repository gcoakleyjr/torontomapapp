const mongoose = require('mongoose');
const cities = require('./cities');
const Post = require('../models/post');
const { places, descriptors } = require('./seedHelper');
const users = require('./users')
const toronto = require('./torontoLocations')

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
        const price = Math.floor(Math.random() * 20) + 10;
        const post = new Post({
            author: users[random1000],
            location: toronto[i].address,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dx1cp4cj9/image/upload/v1656856137/MapApp/uliv0gsanhjekdq4xkam.jpg',
                    filename: 'MapApp/uliv0gsanhjekdq4xkam',
                },
                {
                    url: 'https://res.cloudinary.com/dx1cp4cj9/image/upload/v1656856139/MapApp/qlbvaxa0jjchnjz7uspn.jpg',
                    filename: 'MapApp/qlbvaxa0jjchnjz7uspn',
                }
            ],
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