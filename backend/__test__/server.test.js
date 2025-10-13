// __tests__/server.test.js
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../server.js'; // Import the Express app instance

// Mock the Mongoose connection to prevent actual DB connection during testing
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(), // Always succeed in connecting
  Schema: jest.fn(),
  model: jest.fn(() => ({})),
}));

describe('Server Startup and Basic Routes', () => {
  let server;

  // Before all tests, we need to manually start the server instance
  // Note: We are testing the HTTP request capability, not the mongoose function call here
  beforeAll(async () => {
    // We export the Express app, so Supertest can directly use it
    // The server.js connect function is mocked above
  });

  // Basic Integration Test
  it('GET / should return 200 and the welcome message', async () => {
    const response = await request(app).get('/');

    // 1. Check the HTTP status code
    expect(response.statusCode).toBe(200);

    // 2. Check the response body text
    expect(response.text).toBe('Booktopia Backend API is running!');
  });
  
  // Clean up any listeners after the tests run
  afterAll(async () => {
    // In a full setup, you'd close the server listener if it were started here.
    // Since we only export the app instance, Supertest handles the request lifecycle.
  });
});