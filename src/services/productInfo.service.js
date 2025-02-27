import createApiClient from './api.service';

class ProductInformationService {
    constructor(path = '/product-information') {
        this.api = createApiClient(path);
    }

    async getAllProductsInformation(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createProductInformation(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateProductInformation(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const productInformationService = new ProductInformationService();
