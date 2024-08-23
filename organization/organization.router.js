const express = require('express')
const OrganizationModel = require('../models/Organization')
const ensureAuthenticated = require('../middleware/auth.middleware')
const organizationCreationValidator = require('./organization.validator')
const organizationController = require('./organization.controller')
const router = express.Router();

// Route to view all organizations created by the logged-in user
router.get('/view-organizations/:userID', ensureAuthenticated, organizationController.viewOrganizations)

router.get('/create-organization', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if no user session
    }

    res.render('create-organization', { user: req.session.user })
})

// Create organization
router.post('/create-organization', ensureAuthenticated, organizationCreationValidator, organizationController.createOrganization)

module.exports = router
