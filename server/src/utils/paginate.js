// Helper to calculate pagination numbers (page, limit, skip)
const getPagination = (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const buildPaginationResponse = (totalDocs) => {
        const totalPages = Math.ceil(totalDocs / limit);
        return {
            page,
            limit,
            totalDocs,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    };

    return { page, limit, skip, buildPaginationResponse };
};

// Helper to safely build Mongoose sort object
// Example: getSort({ sortBy: "price", sortOrder: "asc" }, ["price", "createdAt"]) => { price: 1 }
const getSort = (query = {}, allowedFields = ["createdAt"], defaultSort = { createdAt: -1 }) => {
    const { sortBy, sortOrder } = query;

    // If no valid field requested, use default sort (newest first)
    if (!sortBy || !allowedFields.includes(sortBy)) {
        return defaultSort;
    }

    // "asc" means ascending (1), anything else (like "desc") means descending (-1)
    const direction = sortOrder === "asc" ? 1 : -1;

    return { [sortBy]: direction };
};

module.exports = {
    getPagination,
    getSort
};
