// Request and response shapes for Category resource

export interface CategoryRequestBody {
    name?: string;
}

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
