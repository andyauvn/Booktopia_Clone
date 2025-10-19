import mongoose from 'mongoose';
import orderItemSchema from './OrderItemModel.js'; // Import the embedded schema

// Define the schema for the payment result (e.g., from Stripe/PayPal)
const paymentResultSchema = new mongoose.Schema({
    id: String,
    status: String,
    update_time: String,
    email_address: String,
});

// Define the schema for embedded Status History 
const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    notes: String, // Optional notes about the transition
});


const orderSchema = new mongoose.Schema({
    // Reference to the user who placed the order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Array of embedded Order Items (ensures order history is immutable)
    orderItems: {
        type: [orderItemSchema], // Use the imported embedded schema
        required: true,
    },
    // Shipping Address (Embedded) - Critical for order processing
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    // Total price of the order including shipping and taxes
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
        min: [0, 'Total price cannot be negative'],
    },
    // Payment status details
    paymentResult: paymentResultSchema, // Embedded payment result
    
    // === STATUS HISTORY ===
    statusHistory: {
        type: [statusHistorySchema],
        default: [{ status: 'Pending' }], // Start with 'Pending'
    },

    // A getter virtual field for the current status (easier to access)
    // NOTE: Requires { toJSON: { virtuals: true }, toObject: { virtuals: true } } on main schema
    // You would access this as `order.currentStatus`
    trackingNumber: {
        type: String,
        default: null, 
        unique: true, // <-- NEW: Tracking numbers should be unique
        sparse: true, // <-- NEW: Allows null values to not trigger unique constraint
    },
    
    // Timestamps for status tracking
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    
}, {
    timestamps: true,
    // Enable virtuals for the currentStatus getter
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
});

// === VIRTUAL FIELD: Current Status ===
orderSchema.virtual('currentStatus').get(function() {
    // Returns the status of the last element in the history array
    return this.statusHistory.length > 0 
           ? this.statusHistory[this.statusHistory.length - 1].status 
           : 'Unknown';
});


const Order = mongoose.model('Order', orderSchema);

export default Order;
