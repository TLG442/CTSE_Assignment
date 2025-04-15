const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

//user registration
router.post('/register', registerUser);

//user login 
router.post('/login', loginUser);

//get user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;