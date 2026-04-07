// Request and response shapes for Brand resource

export interface BrandRequestBody {
    name?: string;
    description?: string;
}

export interface BrandResponse {
    _id: string;
    name: string;
    description: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

// GET /brands returns a compact list without description, timestamps, or __v
export interface BrandListItem {
    _id: string;
    name: string;
}

export interface BrandErrorResponse {
    error: string;
}
