const OrganizationModel = require('../models/Organization')
const UserModel = require('../models/User')

const viewOrganizations = async (req, res) => {
    try {
        const userID = req.session.user._id; // Use session user ID directly

        // Fetch organizations for the logged-in user
        const organizations = await OrganizationModel.find({
            owner: userID
        });

        if (!organizations || organizations.length === 0) {
            // Render a message or a page stating no organizations found
            return res.render('view-organizations', {
                success: true,
                organizations: [],
                user: req.session.user,
                message: 'No organizations found.'
            });
        }

        return res.status(200).render('view-organizations', {
            success: true,
            organizations,
            user: req.session.user
        });
    } catch (error) {
        console.log('Error fetching Organizations:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });   
    }
}

// Show create organization form
const showCreateOrganizationForm = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if no user session
    }

    res.render('create-organization', { user: req.session.user });
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

        return res.status(201).redirect(`/organization/view-organizations/${organization.owner}`)
    } catch (error) {
        console.log('Error during organization creation:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            data: null
        });
    }
};

// Delete Organization
const deleteOrganization = async (req, res) => {
    try {
        const organizationId = req.params.id;

        // Check if the organization belongs to the logged-in user
        const organization = await OrganizationModel.findOne({
            _id: organizationId,
            owner: req.session.user._id,
        });

        if (!organization) {
            return res.status(404).json({
                message: 'Organization not found or you do not have permission to delete it',
            });
        }

        // Delete the organization
        await OrganizationModel.deleteOne({ _id: organizationId });

        return res.status(200).json({
            message: 'Organization deleted successfully',
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: 'Server Error',
            data: null,
        });
    }
};

// View update organization form
const viewUpdateOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organization = await OrganizationModel.findById(organizationId);
        const user = req.session.user;

        if (!organization) {
            return res.status(404).json({
                message: 'Organization not found',
            });
        }

        res.render('update-organization', { organization, user });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};

const updateOrganization = async (req, res) => {
    try {
        const organizationId = req.params.id; // Get organization ID from the request parameters
        const updatedData = req.body; // Get the updated data from the request body
        const loggedInUserId = req.session.user._id; // Get the logged-in user's ID from the session

        // Find the organization by ID
        const organization = await OrganizationModel.findById(organizationId);

        // If the organization doesn't exist
        if (!organization) {
            return res.status(404).json({
                message: 'Organization not found',
            });
        }

        // Check if the logged-in user is the owner of the organization
        if (organization.owner.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to update this organization',
            });
        }

        // Update the organization with the new data
        const updatedOrganization = await OrganizationModel.findByIdAndUpdate(
            organizationId,
            updatedData,
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        // Respond with the updated organization details
        return res.status(200).redirect(`/organization/view-organizations/${loggedInUserId}`)
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};
module.exports = { 
    createOrganization,
    viewOrganizations, 
    showCreateOrganizationForm, 
    deleteOrganization, 
    viewUpdateOrganizationForm,
    updateOrganization
 }