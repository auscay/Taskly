const express = require('express')
const ensureAuthenticated = require('../middleware/auth.middleware')
const boardCreationValidator = require('./board.validator')
const boardController = require('./board.controller')

const router = express.Router()

// Route to view boards for a specific organization
router.get('/view-boards/:organizationId', ensureAuthenticated, boardController.viewBoards);

// Route to create a new board
router.post('/create-board', ensureAuthenticated, boardCreationValidator, boardController.createBoard);

// Route to show form to create board
router.get('/create-board', ensureAuthenticated, boardController.showCreateBoardForm);

// Get update board by ID form
router.get('/update-board/:boardId', ensureAuthenticated, boardController.viewUpdateBoardForm )

// Route to update a board by ID
router.put('/update-board/:boardId', ensureAuthenticated, boardController.updateBoard);

// Route to delete a board by ID
router.delete('/delete-board/:boardId', ensureAuthenticated, boardController.deleteBoard);

module.exports = router