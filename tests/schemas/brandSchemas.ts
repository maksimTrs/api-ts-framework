// Schema definitions for Brand resource.
// Each schema describes the expected structure for a specific response scenario.
// Used with toStrictEqual() to validate exact response shape (no extra/missing fields).

export const brandSchemas = {
    // GET /brands — each item in the array
    listItem: {
        _id: expect.any(String),
        name: expect.any(String),
    },

    // GET /brands/{id}, POST /brands (200), PUT /brands/{id}
    full: {
        _id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        __v: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
    },

    // POST /brands (422), PUT /brands (422)
    error: {
        error: expect.any(String),
    },
};
