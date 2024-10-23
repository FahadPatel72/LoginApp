const express = require('express');
const { login, logout,signup } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route (protected, requires JWT)
router.post('/logout', authenticateToken, logout);

module.exports = router;
