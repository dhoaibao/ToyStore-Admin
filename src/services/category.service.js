import createApiClient from './api.service';

class CategoryService {
    constructor(path = '/category') {
        this.api = createApiClient(path);
    }

    async getAllCategories(query) {
        return (await this.api.get(`?${query}`)).data;
    }

    async createCategory(data) {
        return (await this.api.post('/', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })).data;
    }

    async updateCategory(id, data) {
        return (await this.api.put(`/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })).data;
    }
}

export const categoryService = new CategoryService();
