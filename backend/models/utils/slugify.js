/**
 * Creates a URL-safe slug from an input string (e.g., a title or name).
 * @param {string} text - The input string to convert.
 * @returns {string} The slugified string.
 */
const createSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars (except space and hyphen)
        .replace(/[\s_-]+/g, '-')    // Replace spaces/underscores/multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
};

export default createSlug;
