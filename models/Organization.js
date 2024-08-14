const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { required } = require('joi');

// Define a schema
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    title: {
        type: String,
        required: true
    },

    board: {
        type: Number,
        required: true
    },

    createdAt : {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const OrganizationModel = mongoose.model('Organization', OrganizationSchema)

module.exports = OrganizationModel