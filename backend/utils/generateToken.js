import jwt from 'jsonwebtoken';

/**
 * Generates a JWT, signs it with the user ID and permissions,
 * and sets it as an secure HTTP-Only cookie in the response.
 * @param {object} res - The Express response object.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @param {string[]} permissions - The user's permission array (e.g., ['user', 'admin']).
 */
const generateToken = (res, userId, permissions) => {
    // IMPORTANT: Make sure you have a strong JWT_SECRET set in your .env file.
    
    // 1. Sign the JWT with the user ID and permissions.
    const token = jwt.sign(
        { userId, permissions },
        process.env.JWT_SECRET || 'default-dev-secret', // MUST be strong in production
        {
            expiresIn: process.env.JWT_EXPIRE || '30d', // 30 days default
        }
    );

    // 2. Set the JWT as an HTTP-Only cookie.
    res.cookie('jwt', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development', // Uncomment for production
        secure: true, // For local development simplicity
        sameSite: 'None', // Recommended for CSRF protection
        maxAge: (process.env.JWT_COOKIE_MAX_AGE || 30) * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
    
    return token;
};

export default generateToken;
