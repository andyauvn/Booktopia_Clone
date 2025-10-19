import mongoose from 'mongoose';

const editionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Edition must reference a Product ID'],
    },    
    // Specific name for this purchasable item (e.g., "Deluxe Hardcover")
    editionName: {
        type: String,
        required: [true, 'Edition name is required to distinguish variants'],
        trim: true,
    },
    // Specific to this SKU
    format: {
        type: String,
        enum: ['Paperback', 'Hardcover', 'eBook', 'Audiobook'],
        required: [true, 'Format is required'],
    },
    image: String, // Cover specific to this edition (e.g., different cover art)
    isbn: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple nulls, but unique if present
    },

    // Pricing Fields (Specific to the purchasable unit)
    fullPrice: {
        type: Number,
        required: [true, 'Edition full price is required'],
        min: [0, 'Full price cannot be negative'],
    },
    discountPrice: {
        type: Number,
        default: null,
        min: [0, 'Discount price cannot be negative'],
        // Custom validation to ensure discountPrice is less than fullPrice
        validate: {
            validator: function(v) {
                return v === null || v < this.fullPrice;
            },
            message: 'Discount price must be less than the full price.',
        },
    },
    costPrice: {
        type: Number,
        default: 0,
        min: [0, 'Cost price cannot be negative'],
    },

    // Inventory
    stockCount: {
        type: Number,
        required: [true, 'Stock count is required'],
        min: [0, 'Stock count cannot be negative'],
        default: 0,
    },
    
}, {
    timestamps: true,
});

const Edition = mongoose.model('Edition', editionSchema);

export default Edition;
