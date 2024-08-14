const express = require('express')
const OrganizationModel = require('../models/Organization')
const organizationCreationValidator = require('./organization.validator')
const organizationController = require('./organization.controller')
const router = express.Router();

// Route to view all organizations created by the logged-in user
router.get('/view-organizations', async (req, res) => {
    try {
        // Ensure the user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Fetch organizations created by the logged-in user
        const organizations = await OrganizationModel.find({ owner: req.session.user._id });

        // Render the view-organizations page with the organizations data
        res.render('view-organizations', { organizations, 
            user: req.session.user
         });
    } catch (error) {
        console.error('Error fetching organizations:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            data: null
        });
    }
});

router.get('/create-organization', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if no user session
    }

    res.render('create-organization', { user: req.session.user })
})

router.post('/create-organization', organizationCreationValidator, organizationController)

module.exports = router
