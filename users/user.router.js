const express = require('express');
const joiValidator = require('./user.validator')
const controller = require('./user.controller')
const router = express.Router();

router.post('/signup', joiValidator.signupValidation, controller.CreateUser)

router.post('/login', joiValidator.LoginValidation, controller.Login)

module.exports = router

