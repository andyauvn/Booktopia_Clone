import mongoose from 'mongoose';
import createSlug from './utils/slugify.js';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    // Used for SEO and friendly URLs (e.g., /categories/science-fiction)
    slug: {
        type: String,
        required: [true, 'A unique slug is required for URL routing.'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'Description cannot exceed 300 characters'],
    },
}, {
    timestamps: true,
});

// === PRE-SAVE HOOK: SLUG GENERATION ===
// Ensures the slug is created or updated whenever the name changes.
categorySchema.pre('save', function(next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = createSlug(this.name);
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
