import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; // The Express app export from server.js
import User from '../models/UserModel.js';

// --- Test Database Setup and Teardown ---

// Connect to the database before running tests
beforeAll(async () => {
    // Connect using a dedicated test environment URI if possible
    await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI, {
        // Removed deprecated options: useNewUrlParser and useUnifiedTopology
    });
});

// Clean up the database after each test (Crucial for TDD)
afterEach(async () => {
    // Delete all users created during the test
    await User.deleteMany();
});

// Close the database connection after all tests are done
afterAll(async () => {
    await mongoose.connection.close();
});

// --- Test Suite for User Registration ---

describe('POST /api/users/register', () => {
    const REGISTER_URL = '/api/users/register';
    
    // Valid user data to be used in multiple tests
    const VALID_USER_DATA = {
        name: 'Test User',
        email: 'test.user@example.com',
        password: 'Password123!',
    };

    // --- TEST 1: SUCCESSFUL REGISTRATION (RED -> GREEN) ---
    test('should register a new user and return status 201', async () => {
        const response = await request(app)
            .post(REGISTER_URL)
            .send(VALID_USER_DATA);

        // Assertions
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.email).toBe(VALID_USER_DATA.email);
        expect(response.body).not.toHaveProperty('password'); // Password should be excluded
        
        // Verify the user was actually saved to the database
        const userInDb = await User.findById(response.body._id).select('+password');
        expect(userInDb).not.toBeNull();
        expect(userInDb.email).toBe(VALID_USER_DATA.email);
    });

    // --- TEST 2: MISSING REQUIRED FIELDS (Failure) ---
    test('should return status 400 if name is missing', async () => {
        const invalidData = { ...VALID_USER_DATA, name: '' };

        const response = await request(app)
            .post(REGISTER_URL)
            .send(invalidData);

        // Assertions
        expect(response.statusCode).toBe(400);
        // Expect an error message indicating validation failure
        expect(response.body.message).toMatch(/User name is required/i);
    });
    
    // --- TEST 3: INVALID PASSWORD FORMAT (Failure) ---
    test('should return status 400 for a password that fails schema validation (e.g., too short)', async () => {
        // Password "fail" is less than the 8-character minimum
        const invalidData = { ...VALID_USER_DATA, password: 'fail' }; 

        const response = await request(app)
            .post(REGISTER_URL)
            .send(invalidData);

        // Assertions
        expect(response.statusCode).toBe(400);
        // UPDATED: Match the message for the 8-character minlength from the UserModel
        expect(response.body.message).toMatch(/Password must be at least 8 characters long/i);
    });

    // --- TEST 4: DUPLICATE EMAIL (Failure) ---
    test('should return status 400 if email already exists', async () => {
        // 1. Create a user directly in the DB
        await User.create(VALID_USER_DATA);

        // 2. Attempt to register the same user again
        const response = await request(app)
            .post(REGISTER_URL)
            .send(VALID_USER_DATA);

        // Assertions
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatch(/User already exists with this email address/i);
    });
});
