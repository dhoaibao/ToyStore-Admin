import createApiClient from './api.service';

class ProductService {
    constructor(path = '/product') {
        this.api = createApiClient(path);
    }

    async getAllProducts(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async getProductBySlug(slug) {
        const response = await this.api.get(`/${slug}`);
        return await response.json();
    }

    async createProduct(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateProduct(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }

    async imageSearch(data) {
        const response = await this.api.post('/image-search', data);
        return await response.json();
    }
}

export const productService = new ProductService();
