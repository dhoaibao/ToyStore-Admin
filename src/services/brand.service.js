import createApiClient from './api.service';

class BrandService {
    constructor(path = '/brand') {
        this.api = createApiClient(path);
    }

    async getAllBrands() {
        return (await this.api.get('/')).data;
    }
}

export const brandService = new BrandService();
