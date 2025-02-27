import createApiClient from './api.service';

class BrandService {
    constructor(path = '/brand') {
        this.api = createApiClient(path);
    }

    async getAllBrands(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createBrand(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateBrand(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const brandService = new BrandService();