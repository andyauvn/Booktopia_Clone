import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

/**
 * @desc Middleware to protect routes: verifies JWT and attaches user to request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check for token in the 'Authorization' header 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (everything after 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Decode the token (verifies signature and expiration)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user (without password) based on the ID from the token payload
            // This ensures the user still exists and their data is fresh.
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                 res.status(401);
                 throw new Error('User not found. Invalid token.');
            }

            next(); // Move to the next middleware/controller
        } catch (error) {
            console.error('Token validation failed:', error.message);
            res.status(401); // 401 Unauthorized
            throw new Error('Not authorized, token failed or expired');
        }
    }

    if (!token) {
        res.status(401); // 401 Unauthorized
        throw new Error('Not authorized, no token provided');
    }
});


/**
 * @desc Middleware to check if the authenticated user has 'admin' permission
 * @param {object} req - Express request object (must have req.user from 'protect' middleware)
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const admin = (req, res, next) => {
    // Check if the user object exists and its permissions array includes 'admin'
    // The user object is attached by the 'protect' middleware
    if (req.user && req.user.permissions.includes('admin')) {
        next(); // User is an admin, proceed
    } else {
        res.status(403); // 403 Forbidden
        throw new Error('Not authorized as an admin');
    }
};


export { protect, admin };
