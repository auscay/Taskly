const express = require('express');
const ensureAuthenticated = require('../middleware/auth.middleware')
const joiValidator = require('./user.validator')
const controller = require('./user.controller')
const router = express.Router();

router.post('/signup', joiValidator.signupValidation, controller.CreateUser)

router.post('/login', joiValidator.LoginValidation, controller.Login)

router.get('/logout', ensureAuthenticated, controller.Logout)

router.get('/login', controller.viewLogin)

// router.get('/', ensureAuthenticated, (req, res) => {
//     // Render the dashboard view with user data
//     res.render('dashboard', { user: req.session.user });
// });

router.get('/dashboard/:userId', ensureAuthenticated, (req, res) => {
    const user = req.session.user;
    if (user && user._id === req.params.userId) {
        res.render('dashboard', { user });
    } else {
        res.status(403).redirect('/user/login'); // Redirect if the user ID doesn't match
    }
});

module.exports = router

