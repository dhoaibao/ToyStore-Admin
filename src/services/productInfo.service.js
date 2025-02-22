import createApiClient from './api.service';

class ProductInformationService {
    constructor(path = '/product-information') {
        this.api = createApiClient(path);
    }

    async getAllProductsInformation(query) {
        return (await this.api.get(`?${query}`)).data;
    }

    async createProductInformation(data) {
        return (await this.api.post('/', data)).data;
    }

    async updateProductInformation(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
}

export const productInformationService = new ProductInformationService();
