// Request and response shapes for Category resource

export interface CategoryRequestBody {
    name: string;
}

// All fields optional — for negative tests with missing required fields
export type CategoryRequestBodyPartial = Partial<CategoryRequestBody>;

export interface CategoryResponse {
    _id: string;
    name: string;
    __v: number;
}

export interface CategoryListItem {
    _id: string;
    name: string;
}

export interface CategoryErrorResponse {
    error: string;
}
