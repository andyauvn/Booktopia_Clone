import express from 'express';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

// Route for creating a new user: POST /api/users/register
router.route('/register').post(registerUser);

// NOTE: You will mount this router in your main server.js file like this:
// app.use('/api/users', userRoutes);

export default router;
