const express = require('express')
const OrganizationModel = require('../models/Organization')
const ensureAuthenticated = require('../middleware/auth.middleware')
const { organizationCreationValidator, organizationUpdateValidator } = require('./organization.validator')
const organizationController = require('./organization.controller')
const router = express.Router();

// Route to view all organizations created by the logged-in user
router.get('/view-organizations/:userID', ensureAuthenticated, organizationController.viewOrganizations)

// Show create organization
router.get('/create-organization', ensureAuthenticated, organizationController.showCreateOrganizationForm);

// Create organization
router.post('/create-organization', ensureAuthenticated, organizationCreationValidator, organizationController.createOrganization)

// Get Update organization by ID form
router.get('/update-organization/:id', ensureAuthenticated, organizationController.viewUpdateOrganizationForm);

// Update organization by ID
router.put('/update-organization/:id', ensureAuthenticated, organizationUpdateValidator, organizationController.updateOrganization);


// Delete organization by ID
router.delete('/delete-organization/:id', ensureAuthenticated, organizationController.deleteOrganization);

module.exports = router
