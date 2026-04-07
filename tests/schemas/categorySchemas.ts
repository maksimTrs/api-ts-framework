// Schema definitions for Category resource.
// Each schema describes the expected structure for a specific response scenario.
// Used with toStrictEqual() to validate exact response shape (no extra/missing fields).

export const categorySchemas = {
    // GET /categories — each item in the array
    listItem: {
        _id: expect.any(String),
        name: expect.any(String),
    },

    // POST /categories (200), DELETE /categories/{id} (200)
    full: {
        _id: expect.any(String),
        name: expect.any(String),
        __v: expect.any(Number),
    },

    // POST /categories (422)
    error: {
        error: expect.any(String),
    },
};
