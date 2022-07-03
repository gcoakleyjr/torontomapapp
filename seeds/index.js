const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/map-app')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "62c0984a7f2870edab1db936",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
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
                coordinates: [-79.393757, 43.660737]
            }
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})