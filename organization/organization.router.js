const express = require('express')
const OrganizationModel = require('../models/Organization')
const ensureAuthenticated = require('../middleware/auth.middleware')
const organizationCreationValidator = require('./organization.validator')
const organizationController = require('./organization.controller')
const router = express.Router();

// Route to view all organizations created by the logged-in user
router.get('/view-organizations/:userID', ensureAuthenticated, organizationController.viewOrganizations)

// Show create organization
router.get('/create-organization', ensureAuthenticated, organizationController.showCreateOrganizationForm);

// Create organization
router.post('/create-organization', ensureAuthenticated, organizationCreationValidator, organizationController.createOrganization)

// Delete organization by ID
router.delete('/delete-organization/:id', ensureAuthenticated, organizationController.deleteOrganization);

module.exports = router
