// Custom Error Middleware to handle API errors and Mongoose errors

// 1. Middleware for handling 404 (Not Found) errors
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the next error handler
};

// 2. Generic Error Handler
const errorHandler = (err, req, res, next) => {
    // Determine the status code: Use the error's status code if available,
    // otherwise default to 500 (Internal Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // A. Handle Mongoose Cast Error (e.g., invalid ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // B. Handle Mongoose Validation Error (e.g., missing required fields, invalid format)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        // Concatenate all validation messages into a single string
        message = Object.values(err.errors)
            .map(val => val.message)
            .join('; ');
    }

    // C. Handle Mongoose Duplicate Key Error (Code 11000)
    if (err.code === 11000) {
        statusCode = 400;
        // Extract the duplicated field name
        const field = Object.keys(err.keyValue).join(', ');
        message = `Duplicate field value: ${field}. Please use another value.`;
    }

    // Send the response
    res.status(statusCode).json({
        message: message,
        // Only include stack trace in development mode for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };
