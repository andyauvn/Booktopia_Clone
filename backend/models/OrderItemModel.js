import mongoose from 'mongoose';

// This is an EMBEDDED schema, meaning it is not registered as a separate Mongoose model 
// but is used as an array element type inside the Order model.
const orderItemSchema = new mongoose.Schema({
    // Reference to the specific Edition (SKU) purchased (Hardcover, Paperback, etc.)
    edition: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Edition', // Assuming 'Edition' holds SKU details (format, price, stock)
        required: true,
    },
    // Snapshot of the book's core data for display purposes
    productTitle: {
        type: String,
        required: true,
    },
    editionName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    // Price at the moment of purchase (CRITICAL for historical accuracy)
    priceAtPurchase: {
        type: Number,
        required: true,
        min: [0, 'Price at purchase cannot be negative'],
    },
    // Additional data to store
    eBookFileUrl: {
        type: String,
        default: null, // If it's a digital edition, store the link here
    }
});

// We only export the schema, which is used for embedding in the Order model.
export default orderItemSchema;
