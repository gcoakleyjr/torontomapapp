if (process.env.NODE_ENV !== "production") { //in development mode, take env into file, in production, we do something else
    require('dotenv').config();
}

const mongoose = require("mongoose")
const express = require('express');
const app = express();
const path = require("path")  //allows you to access views from whichever folder, not just home folder
const methodOverride = require("method-override") //allows you to send put and delete request from forms
const engine = require("ejs-mate") //allows you to do layout
const ExpressError = require("./utils/ExpressError"); //our custom error handle class for throwing errors with custom message and status code
const sessions = require("express-session") //saves information to the server side for use when revisting webpages. Cookies are client side and limited
const flash = require("connect-flash") // used for flashing messages
const passport = require("passport") //use for user login stuff install passport$0.5.0 for now, or else redirect wont work
const localStrategy = require("passport-local")
const User = require("./models/user") //our user login schema
const mongoSanitize = require("express-mongo-sanitize") //makes sure someone doesnt try to pass bad querys
const ExpressMongoSanitize = require('express-mongo-sanitize');
//const helmet = require("helmet") //security

// TODO
//     ADD TRENDING
//     ADD NEARBY POSTS
//     FOOTER
//     LIKES
//     LINK ADDRESS TO MAPS
//     LOCATION FROM GPS

// routes
const posts = require("./routes/posts")
const reviews = require("./routes/reviews")
const users = require("./routes/users");



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
app.use(mongoSanitize())
//app.use(helmet)

const sessionConfig = { //how you set up sessions, just do it
    name: "xH2yzf",
    secret: "secretis",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true, //when its https, the cookies wont show, on local host it breaks
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(sessions(sessionConfig))
app.use(flash()) // need sessions installed

app.use(passport.initialize()) //required to intialize passport
app.use(passport.session()) //used for persistent login sessions (make sure this is after app.use(sessions))
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) //how you get user into the sessions
passport.deserializeUser(User.deserializeUser()) //how you get users out. methods on the passport plugin

app.use((req, res, next) => { //do this for flash to work on every template and no need to pass through as data 
    res.locals.currentUser = req.user  //this isnt flash, its passport, helps us pass info on the user on each request without having to do it manually. used for if user is logged in or not
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})


//define post route
app.use("/posts", posts)
app.use("/posts/:id/reviews", reviews)
app.use("/", users)


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