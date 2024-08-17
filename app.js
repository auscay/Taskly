const express = require("express")
const bodyParser = require('body-parser');
const session = require('express-session');
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
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    validate: {xForwardedForHeader: false}
})

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET, // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set to true if using HTTPS
}));

app.use(limiter)

app.get("/", (req, res) => {
    res.render('index', {
        message: 'Welcome To Taskly'
    })
}) 

// Signup and Login Route
app.get("/signup", (req, res) => {
    res.render('signup')
})
app.get("/login", (req, res) => {
    res.render('login')
})
app.post("/signup", userRoute)
app.post("/login", userRoute)

// User dashboard
app.get("/dashboard", userRoute)

// View Organizations
app.get("/view-organizations", organizationRoute)
// Display Create Organization Form
app.get("/create-organization", organizationRoute) 
// Create Organization
app.post("/create-organization", organizationRoute)

// Use the organization
app.use('/organization', organizationRouter)

// Use the board router
app.use('/boards', boardRouter);

module.exports = app