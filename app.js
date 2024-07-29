const express = require("express")
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const { connectToMongoDB } = require('./db')
const PORT = process.env.PORT


dotenv.config()

// Connect To MongoDb
connectToMongoDB()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Welcome To Taskly!")
})

app.listen(PORT, ()=> {
    console.log(`Server started on PORT: http://localhost:${PORT}`);
})