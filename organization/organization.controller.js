const OrganizationModel = require('../models/Organization')

const createOrganization = async (req, res) => {
    try {
        const bodyOfRequest = req.body;
        
        console.log('Checking for existing organization title...');

        // Check for existing organization title
        const existingOrganizationTitle = await OrganizationModel.findOne({
            title: bodyOfRequest.title,
            owner: req.session.user._id  // Filter by the logged-in user's ID
        });

        console.log('Existing organization check complete.');

        if (existingOrganizationTitle) {
            console.log('Organization title already exists.');
            return res.status(409).json({
                message: 'Organization title already exists',
            });
        }

        // Create Organization
        console.log('Creating new organization...');
        const organization = await OrganizationModel.create({
            owner: req.session.user._id,
            title: bodyOfRequest.title,
            board: bodyOfRequest.board
        });

        console.log('Organization created successfully.');
        return res.status(201).json({
            message: `${organization.title} Organization created successfully`,
            data: organization
        });
    } catch (error) {
        console.error('Error during organization creation:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            data: null
        });
    }
};

module.exports = createOrganization