import createApiClient from './api.service';

class ProductService {
    constructor(path = '/product') {
        this.api = createApiClient(path);
    }

    async getAllProducts(query) {
        return (await this.api.get(`/?${query}`)).data;
    }

    async getProductBySlug(slug) {
        return (await this.api.get(`/${slug}`)).data;
    }

    async createProduct(data) {
        return (await this.api.post('/', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })).data;
    }

    async updateProduct(id, data) {
        return (await this.api.put(`/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })).data;
    }

    async imageSearch(data) {
        return (await this.api.post('/image-search', data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })).data;
    }
}

export const productService = new ProductService();