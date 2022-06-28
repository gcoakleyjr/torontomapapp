const mongoose = require("mongoose")
const express = require('express');
const app = express();
const path = require("path")  //allows you to access views from whichever folder, not just home folder
const methodOverride = require("method-override") //allows you to send put and delete request from forms
const engine = require("ejs-mate") //allows you to do layout
const ExpressError = require("./utils/ExpressError"); //our custom error handle class for throwing errors with custom message and status code
const sessions = require("express-session") //saves information to the server side for use when revisting webpages. Cookies are client side and limited
const { privateDecrypt } = require("crypto");
const flash = require("connect-flash") // used for flashing messages

// routes
const campgrounds = require("./routes/campgrounds")
const reviews = require("./routes/reviews")


//connect mongoose
mongoose.connect('mongodb://localhost:27017/map-app')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", engine)
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = { //how you set up sessions, just do it
    secret: "secretis",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(sessions(sessionConfig))
app.use(flash()) // need sessions installed
app.use((req, res, next) => { //do this for flash to work on every template and no need to pass through as data 
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})



//define campground route
app.use("/campgrounds", campgrounds)
app.use("/campground/:id/reviews", reviews)


//CRUD
app.get('/', (req, res) => {
    res.render('home')
});


//Error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})