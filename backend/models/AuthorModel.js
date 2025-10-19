import mongoose from 'mongoose';
import createSlug from './utils/slugify.js'; 

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Author name is required'],
        unique: true,
        trim: true,
    },
    // Used for SEO and friendly URLs (e.g., /authors/frank-herbert)
    slug: {
        type: String,
        required: [true, 'A unique slug is required for URL routing.'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    bio: {
        type: String,
        trim: true,
        default: 'No biography available.',
    },
}, {
    timestamps: true,
    // Enable virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// === PRE-SAVE HOOK: SLUG GENERATION ===
authorSchema.pre('save', function(next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = createSlug(this.name);
    }
    next();
});

// === VIRTUAL FIELD: Products/Books ===
// This allows fetching all Product documents by this Author easily.
authorSchema.virtual('products', {
    ref: 'Product', // The model to use (the books)
    localField: '_id', // Field in the Author model (the unique ID)
    foreignField: 'author', // Field in the Product model that holds the reference to Author
});

const Author = mongoose.model('Author', authorSchema);

export default Author;
