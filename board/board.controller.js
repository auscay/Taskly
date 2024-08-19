const BoardModel = require('../models/Board')
const OrganizationModel = require('../models/Organization')

const createBoard = async (req, res, next) => {
    try {
        const bodyOfRequest = req.body
        
        // Check if the organization exists and belongs to the logged-in user
        const organization = await OrganizationModel.findOne({
            _id: bodyOfRequest.organization,
            owner: req.session.user._id
        });

        if (!organization) {
            return res.status(404).json({
                message: 'Organization not found or you do not have permission to add boards to this organization',
                success: false
            });
        }

        // Check if a board with the same name already exists within the organization
        const existingBoard = await BoardModel.findOne({
            name: bodyOfRequest.name,
            organization: bodyOfRequest.organization
        });

        if (existingBoard) {
            return res.status(409).json({
                message: 'A board with this name already exists in your organization',
                success: false
            });
        }

        // Create a new board
        const newBoard = new BoardModel({
            name: bodyOfRequest.name,
            organization: bodyOfRequest.organization,
        });

        await newBoard.save();

        return res.status(201).json({
            message: 'Board created successfully',
            success: true,
            data: newBoard
        });
    } catch (error) {
        console.error('Error creating board:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
            error: error.message
        });
    }
}

const viewBoards = async (req, res) => {
    try {
        const { organizationId } = req.params;

        // Fetch boards for the specified organization and the logged-in user
        const boards = await BoardModel.find({
            organization: organizationId,
            // owner: req.session.user._id
        });
        
        

        if (!boards || boards.length === 0) {
            return res.status(404).json({
                message: 'No boards found for this organization',
                success: false
            });
        }

        return res.status(200).render('view-boards', {
            success: true,
            boards,
            user: req.session.user // Pass the user object for display in the view
        });
    } catch (error) {
        console.error('Error fetching boards:', error.message);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
            error: error.message
        });
    }
};

// Show the form for creating a new board
const showCreateBoardForm = async (req, res) => {
    try {
        // Fetch organizations that the logged-in user owns
        const organizations = await OrganizationModel.find({ owner: req.session.user._id });

        // Render the form and pass the organizations to the view
        res.render('create-board', { organizations, message: null });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

module.exports = { createBoard, viewBoards, showCreateBoardForm }