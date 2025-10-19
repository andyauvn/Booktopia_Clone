import User from '../models/UserModel.js';
import asyncHandler from 'express-async-handler'; // A helpful utility for handling exceptions inside async routes

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists (Mongoose unique index handles most of this, 
    // but an explicit check provides a cleaner error message)
    const userExists = await User.findOne({ email });

    if (userExists) {
        // HTTP 400 Bad Request
        res.status(400);
        throw new Error('User already exists with this email address');
    }

    // Attempt to create the user. 
    // Mongoose pre('save') hook handles password hashing automatically here.
    const user = await User.create({
        name,
        email,
        password,
        // Default permissions are set in the schema, no need to pass them here
    });

    if (user) {
        // HTTP 201 Created - Respond with user data (excluding the hashed password)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            permissions: user.permissions,
            // NOTE: In a real app, you would generate and send a JWT here.
            message: 'User registered successfully. Please log in.'
        });
    } else {
        // This is caught if Mongoose validation (like min/max length) fails
        res.status(400);
        throw new Error('Invalid user data received. Check fields for complexity and length.');
    }
});

export { registerUser };
