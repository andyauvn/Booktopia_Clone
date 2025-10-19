import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    // Reference to the user who submitted the review
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Reference to the Product (Book) being reviewed
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Using 'Product' to match the uploaded ProductModel.js
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    // Moderation flag to control public visibility
    isApproved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// --- SCHEMA INDEXES ---
// Ensures a user can only leave one review per book (unique compound index)
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
