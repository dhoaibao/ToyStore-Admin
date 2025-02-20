import createApiClient from './api.service';

class CategoryService {
    constructor(path = '/category') {
        this.api = createApiClient(path);
    }

    async getAllCategories() {
        return (await this.api.get('/')).data;
    }
}

export const categoryService = new CategoryService();
