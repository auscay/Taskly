const mongoose = require('mongoose')

// Define a schema
const Schema = mongoose.Schema

const BoardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
})

module.exports = mongoose.model('Board', BoardSchema)