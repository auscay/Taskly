const express = require('express')
const ensureAuthenticated = require('../middleware/auth.middleware')
const BoardModel = require('../models/Board')
const boardCreationValidator = require('./board.validator')
const { createBoard, viewBoards, showCreateBoardForm } = require('./board.controller')

const router = express.Router()

// Route to view boards for a specific organization
router.get('/view-boards/:organizationId', ensureAuthenticated, viewBoards);

// Route to create a new board
router.post('/create-board', ensureAuthenticated, boardCreationValidator, createBoard);

// Route to show form to create board
router.get('/create-board', ensureAuthenticated, showCreateBoardForm);


module.exports = router