const express = require('express');
const joiValidator = require('./user.validator')
const controller = require('./user.controller')
const router = express.Router();

router.post('/signup', joiValidator.signupValidation, controller.CreateUser)

router.post('/login', joiValidator.LoginValidation, controller.Login)

router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if no user session
    }

    // Render the dashboard view with user data
    res.render('dashboard', { user: req.session.user });
});

module.exports = router

