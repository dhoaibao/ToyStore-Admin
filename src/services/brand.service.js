import createApiClient from './api.service';

class BrandService {
    constructor(path = '/brand') {
        this.api = createApiClient(path);
    }

    async getAllBrands(query) {
        return (await this.api.get(`?${query}`)).data;
    }

    async createBrand(data) {
        return (await this.api.post('/', data)).data;
    }

    async updateBrand(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
}

export const brandService = new BrandService();
