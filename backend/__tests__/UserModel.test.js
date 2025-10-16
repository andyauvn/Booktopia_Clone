import mongoose from 'mongoose';
import User from '../models/UserModel.js';

describe('User Model Validation and Security', () => {
    // Sample password meets requirements: 8 chars, Upper, Lower, Number, Special
    const validPassword = 'SecureP@ss1';
    
    // A sample user object that should pass all validation
    const validUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: validPassword, 
        permissions: ['user'],
    };

    // --- SECURITY TEST: PASSWORD HASHING ---
    it('should hash the password automatically and correctly match the plaintext input', async () => {
        const userInstance = new User(validUser);
        let savedUser;
        
        try {
            savedUser = await userInstance.save();
        } catch (error) {
            fail(`Failed to save user for hashing test: ${error.message}`);
        }
        
        // 1. Ensure the saved password is not the plaintext string
        const isHashed = savedUser.password && savedUser.password !== validUser.password;
        expect(isHashed).toBe(true);

        // 2. Use the instance method to verify the hash works
        // This is the core check for the pre('save') hook implementation.
        const passwordMatches = await savedUser.matchPassword(validUser.password);
        expect(passwordMatches).toBe(true);
    });

    // --- VALIDATION TEST: PASSWORD LENGTH AND COMPLEXITY ---

    it('should fail validation if password is too short (less than 6 characters)', async () => {
        const shortPasswordUser = new User({ ...validUser, email: 'short@pass.com', password: 'A!1' });
        await expect(shortPasswordUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should fail validation if password is too long (more than 32 characters)', async () => {
        // Creates a 33 character string meeting complexity
        const longPassword = 'A!1' + 'a'.repeat(30); 
        const longPasswordUser = new User({ ...validUser, email: 'long@pass.com', password: longPassword });
        await expect(longPasswordUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
    
    it('should fail validation if password is missing a number', async () => {
        // Missing a digit [0-9]
        const noNumberUser = new User({ ...validUser, email: 'nonumber@test.com', password: 'SecurePassword!' });
        await expect(noNumberUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should fail validation if password is missing a special character', async () => {
        // Missing a non-alphanumeric character
        const noSpecialCharUser = new User({ ...validUser, email: 'nospecial@test.com', password: 'SecurePassword1' });
        await expect(noSpecialCharUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should fail validation if password is missing an uppercase letter', async () => {
        // Missing an uppercase letter [A-Z]
        const noUppercaseUser = new User({ ...validUser, email: 'noupper@test.com', password: 'securepassword1!' });
        await expect(noUppercaseUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
    
    it('should fail validation if password is missing a lowercase letter', async () => {
        // Missing a lowercase letter [a-z]
        const noLowercaseUser = new User({ ...validUser, email: 'nolower@test.com', password: 'SECUREPASSWORD1!' });
        await expect(noLowercaseUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });


    // --- VALIDATION TEST: REQUIRED FIELDS ---
    it('should fail validation if name is missing', async () => {
        const userWithoutName = new User({
            email: 'missingname@test.com',
            password: validPassword,
            permissions: ['user']
        });
        await expect(userWithoutName.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    // --- VALIDATION TEST: FORMATTING ---
    it('should fail validation if the email format is invalid', async () => {
        const invalidEmailUser = new User({
            ...validUser,
            email: 'not-an-email', 
            password: validPassword // Use valid password to isolate email error
        });

        await expect(invalidEmailUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    // --- VALIDATION TEST: ENUM (Permissions) ---
    it('should fail validation if permissions array contains an invalid role', async () => {
        const invalidRoleUser = new User({
            ...validUser,
            email: 'invalidrole@test.com',
            permissions: ['user', 'super-admin'] // 'super-admin' is not in the enum list
        });
        
        await expect(invalidRoleUser.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
});
