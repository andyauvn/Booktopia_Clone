import express from 'express';
import { authUser, registerUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
// POST /api/users/register - Create a new user account
router.route('/register').post(registerUser);

// POST /api/users/login - Authenticate user and get token
router.route('/login').post(authUser);

// POST /api/users/logout - Log out a user
//router.post('/logout', logoutUser);

// Admin Protected Route Example
// GET /api/users - Fetch all users (Requires 'protect' and 'admin' middleware)
router.route('/').get(protect, admin, (req, res) => {
});

export default router;
