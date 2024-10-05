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
            // return res.status(404).json({
            //     message: 'Organization not found or you do not have permission to add boards to this organization',
            //     success: false
            // });
            return res.status(404).render('create-board', {
                message: 'Organization not found or you do not have permission to add boards to this organization',
            })
        }

        // Check if a board with the same name already exists within the organization
        const existingBoard = await BoardModel.findOne({
            name: bodyOfRequest.name,
            organization: bodyOfRequest.organization
        });

        if (existingBoard) {
            // return res.status(409).json({
            //     message: 'A board with this name already exists in your organization',
            //     success: false
            // });
        // Fetch organizations that the logged-in user owns
        const organizations = await OrganizationModel.find({ owner: req.session.user._id });
            return res.status(404).render('create-board', {
                message: 'A board with this name already exists in your organization',
                success: false,
                organizations
            })
        }

        // Create a new board
        const newBoard = new BoardModel({
            name: bodyOfRequest.name,
            organization: bodyOfRequest.organization,
        });

        await newBoard.save();

        // return res.status(201).json({
        //     message: 'Board created successfully',
        //     success: true,
        //     data: newBoard
        // });
        // Fetch organizations that the logged-in user owns
        const organizations = await OrganizationModel.find({ owner: req.session.user._id });
        return res.status(201).render('create-board', {
            message: 'Board created successfully',
            success: true,
            data: newBoard,
            organizations
        })
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
        console.log('Error fetching boards:', error.message);
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
        res.render('create-board', { 
            organizations,
            message: null,
            success: ''
            });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Show the form to update existing board
const viewUpdateBoardForm = async (req, res) => {
    try {
      const { boardId } = req.params;
  
      // Find the board by ID and populate the organization field
      const board = await BoardModel.findById(boardId).populate('organization');
  
      if (!board) {
        return res.status(404).json({
          message: 'Board not found',
          success: false,
        });
      }
  
      // Ensure that `board.organization` is populated and has an owner
      if (!board.organization || !board.organization.owner) {
        return res.status(400).json({
          message: 'Organization information is missing or incomplete',
          success: false,
        });
      }
  
      // Ensure the logged-in user is the owner of the organization
      if (board.organization.owner.toString() !== req.session.user._id.toString()) {
        return res.status(403).json({
          message: 'You are not authorized to update this board',
          success: false,
        });
      }
  
      // Render the update board form
      return res.status(200).render('update-board', {
        success: true,
        board,
        user: req.session.user,
      });
    } catch (error) {
      console.log('Error fetching board for update:', error.message);
      return res.status(500).json({
        message: 'Server Error',
        success: false,
        error: error.message,
      });
    }
  };
  

// Update an existing board
const updateBoard = async (req, res) => {
    try {
      const { boardId } = req.params; // Get board ID from the request parameters
      const bodyOfRequest = req.body; // Get the updated board details from the request body
  
      // Find the board by ID and populate the organization details
      const board = await BoardModel.findById(boardId).populate('organization');
  
      // Check if the board exists
      if (!board) {
        return res.status(404).json({
          message: 'Board not found',
          success: false,
        });
      }
  
      // Ensure the logged-in user is the owner of the organization
      if (board.organization.owner.toString() !== req.session.user._id.toString()) {
        return res.status(403).json({
          message: 'You are not authorized to update this board',
          success: false,
        });
      }
  
      // Update board details
      board.name = bodyOfRequest.name || board.name;
    //   board.tasks = bodyOfRequest.tasks || board.tasks;
  
      // Save the updated board
      await board.save();
  
      // Respond with success
      return res.status(200).json({
        message: 'Board updated successfully',
        success: true,
        data: board,
      });
    } catch (error) {
      console.log('Error updating board:', error.message);
      return res.status(500).json({
        message: 'Server Error',
        success: false,
        error: error.message,
      });
    }
  };

  // Delete a board by ID
const deleteBoard = async (req, res) => {
    try {
      const { boardId } = req.params;
  
      // Find the board by its ID
      const board = await BoardModel.findById(boardId).populate('organization');
  
      if (!board) {
        return res.status(404).json({
          message: 'Board not found',
          success: false
        });
      }
  
      // Ensure the logged-in user is the owner of the organization
      if (board.organization.owner.toString() !== req.session.user._id.toString()) {
        return res.status(403).json({
          message: 'You are not authorized to delete this board',
          success: false
        });
      }
  
      // If authorized, delete the board
      await board.deleteOne();
  
      return res.status(200).json({
        message: 'Board deleted successfully',
        success: true
      });
    } catch (error) {
      console.log('Error deleting board:', error.message);
      return res.status(500).json({
        message: 'Server Error',
        success: false,
        error: error.message
      });
    }
  };
  

  


module.exports = {
    createBoard,
    viewBoards,
    showCreateBoardForm,
    viewUpdateBoardForm,
    updateBoard,
    deleteBoard
}