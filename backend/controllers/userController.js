import User from '../models/UserModel.js';
import asyncHandler from 'express-async-handler'; // A helpful utility for handling exceptions inside async routes
import generateToken from '../utils/generateToken.js';

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
    console.log('User created')
    if (user) {

         // --- JWT GENERATION ---
        const token = generateToken(res, user._id, user.permissions);
        // ----------------------

        // Log successful registration
        console.log(`✅ New user account created for: ${user.email}`);
        // HTTP 201 Created - Respond with user data (excluding the hashed password)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            permissions: user.permissions,
            token, // Send the token to the client!
            message: 'User registered successfully. Please log in.'
        });
    } else {
        // This is caught if Mongoose validation (like min/max length) fails
        res.status(400);
        throw new Error('Invalid user data received. Check fields for complexity and length.');
    }
});


/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Explicitly select the password hash for comparison
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists AND if the password matches using the instance method
    if (user && (await user.matchPassword(password))) {
        // Generate JWT
        const token = generateToken(res, user._id, user.permissions);

        // Successful login: Respond with user data and the token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            permissions: user.permissions,
            token,
        });
    } else {
        res.status(401); // 401 Unauthorized
        throw new Error('Invalid email or password');
    }
});

// /**
//  * @desc    Logout user / Clear cookie
//  * @route   POST /api/users/logout
//  * @access  Public (Anyone can hit this to clear their cookie)
//  */
// const logoutUser = asyncHandler(async (req, res) => {
//     // Clear the HTTP-only cookie by setting it to an empty value and an immediate expiry
//     res.cookie('jwt', '', {
//         httpOnly: true,
//         expires: new Date(0), // Set expiry to a past date (January 1, 1970)
//         secure: process.env.NODE_ENV !== 'development', // Use secure in production
//         sameSite: 'strict', // Protect against CSRF attacks
//     });

//     console.log(`✅ User logged out successfully.`);
//     // HTTP 200 OK
//     res.status(200).json({ message: 'User logged out successfully' });
// });



export { registerUser, authUser };
