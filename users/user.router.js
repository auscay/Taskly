const express = require('express');
const ensureAuthenticated = require('../middleware/auth.middleware')
const joiValidator = require('./user.validator')
const controller = require('./user.controller')
const router = express.Router();

router.post('/signup', joiValidator.signupValidation, controller.CreateUser)

router.post('/login', joiValidator.LoginValidation, controller.Login)

router.get('/', ensureAuthenticated, (req, res) => {
    // Render the dashboard view with user data
    res.render('dashboard', { user: req.session.user });
});

module.exports = router

