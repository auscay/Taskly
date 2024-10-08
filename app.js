const express = require("express")
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')
const { connectToMongoDB } = require('./db')
const userRoute = require('./users/user.router')
const organizationRouter = require('./organization/organization.router')
const boardRouter = require('./board/board.router')

dotenv.config()

// Connect To MongoDb
connectToMongoDB()

const app = express()

//  Set ejs as templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// Configure rate limiter

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 30, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    validate: {xForwardedForHeader: false}
})

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET, // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(limiter)

// Use method-override to handle DELETE and PUT methods in forms
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
    res.render('index', {
        message: 'Welcome To Taskly'
    })
}) 

// User Route
app.use('/user', userRoute)

// Use the organization
app.use('/organization', organizationRouter)

// Use the board router
app.use('/boards', boardRouter);

module.exports = app
