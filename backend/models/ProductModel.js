import mongoose from 'mongoose';
import createSlug from './utils/slugify';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
    },
    // Reference to Author Model 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: [true, 'Product author reference is required'],
    },
    // Slug applies to the entire product page (e.g., /products/dune)
    slug: {
        type: String,
        required: [true, 'A unique slug is required for SEO and URL routing.'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    // Categories apply to the overall Product
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'At least one category is required for a product'],
    }],

    // === REVIEW CACHING FIELDS ===
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numOfReviews: {
        type: Number,
        default: 0,
        min: 0,
    },
    
    // === MAIN IMAGE FIELD ===
    // Main image for the book/product, used in listings and search results.
    mainImageUrl: {
        type: String,
        default: 'https://placehold.co/600x900/4F46E5/FFFFFF?text=Book+Cover',
    },
    
    // Additional IP metadata
    publicationDate: Date,
    publisher: String,
    
}, {
    timestamps: true,
    // Enable virtuals for populating editions
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
});

// === PRE-SAVE HOOK: SLUG GENERATION ===
// Ensures the slug is created or updated whenever the title changes.
productSchema.pre('save', function(next) {
    if (this.isModified('title') || this.isNew) {
        this.slug = createSlug(this.title);
    }
    next();
});

// === VIRTUAL FIELD: Editions ===
// This allows fetching all related Editions (SKUs) easily from a Product document.
productSchema.virtual('editions', {
    ref: 'Edition', // The model to use
    localField: '_id', // Field in the Product model (the unique ID)
    foreignField: 'product', // Field in the Edition model that holds the reference to Product
});

const Product = mongoose.model('Product', productSchema);

export default Product;