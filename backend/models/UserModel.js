import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User Schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        // Simple regex for email format validation
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password cannot exceed 128 characters'],
         match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                'Password must be 8+ characters long and include uppercase, lowercase, and a number.'
               ],
        // Exclude the password from being returned in query results by default
        select: false,
    },
    // Used for access control (Admin, User, Editor)
    permissions: {
        type: [String], // Array of roles/permissions
        required: true,
        default: ['user'], // Default role is 'user'
        enum: {
            values: ['user', 'admin', 'editor'],
            message: 'Permissions must be one of: user, admin, editor'
        }
    },
    // References to books the user wants to buy later
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    // Used for password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true // adds createdAt and updatedAt fields
});

// --- SCHEMA METHODS & HOOKS ---

// 1. Pre-save hook to hash the password before saving the document (Security)
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) {
        return next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 2. Instance method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
