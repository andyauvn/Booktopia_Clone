import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/UserModel.js'; // Ensure the path is correct

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connection established for seeder.');
    } catch (error) {
        console.error(`Seeder DB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// --- DATA IMPORT FUNCTION ---
const importData = async () => {
    try {
        await connectDB();

        // Clear any existing users to avoid duplicates during testing (optional)
        await User.deleteMany();

        // Check for required environment variables
        if (!process.env.ADMIN_NAME || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.error('Error: Please define ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in your .env file.');
            process.exit(1);
        }

        // Create the admin user
        const adminUser = new User({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD, // Hashing is handled by the pre-save hook in UserModel
            permissions: ['admin', 'user'], // Assign both admin and user roles
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error during data import: ${error.message}`);
        process.exit(1);
    }
};

// --- DATA DESTRUCTION FUNCTION ---
const destroyData = async () => {
    try {
        await connectDB();

        await User.deleteMany(); // Deletes all users

        console.log('🔥 Data destroyed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error during data destruction: ${error.message}`);
        process.exit(1);
    }
};

// --- COMMAND LINE LOGIC ---
// This allows running 'node seeder.js -d' to destroy data
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
