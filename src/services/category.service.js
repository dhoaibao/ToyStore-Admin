import createApiClient from './api.service';

class CategoryService {
    constructor(path = '/category') {
        this.api = createApiClient(path);
    }

    async getAllCategories(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createCategory(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateCategory(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const categoryService = new CategoryService();