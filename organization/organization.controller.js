const OrganizationModel = require('../models/Organization')
const UserModel = require('../models/User')

const viewOrganizations = async (req, res) => {
    try {
        const { userID } = req.params
        // Fetch organizations for the logged-in user
        const organizations = await OrganizationModel.find({
            owner: userID
        })
        if (!organizations || organizations.length === 0) {
            return res.status(404).json({
                message: 'No Organization found for this user',
                success: false
            });
        }
        return res.status(200).render('view-organizations', {
            success: true,
            organizations,
            user: req.session.user
        })
    } catch (error) {
        console.log('Error fetching Organizations:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
            error: error.message
        });   
    }
}

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
        // return res.status(201).json({
        //     message: `${organization.title} Organization created successfully`,
        //     data: organization
        // });
        return res.status(201).redirect(`/organizations/view-organization/${organization.owner}`)
    } catch (error) {
        console.log('Error during organization creation:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            data: null
        });
    }
};

module.exports = { createOrganization, viewOrganizations }