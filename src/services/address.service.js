import createApiClient from './api.service';

class AddressService {
    constructor(path = '/address') {
        this.api = createApiClient(path);
    }

    async addAddress(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async getAddressByUser() {
        const response = await this.api.get('/user');
        return await response.json();
    }

    async updateAddress(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }

    async deleteAddress(id) {
        const response = await this.api.delete(`/${id}`);
        return await response.json();
    }
}

export const addressService = new AddressService();