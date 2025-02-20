import createApiClient from './api.service';

class AddressService {
    constructor(path = '/address') {
        this.api = createApiClient(path);
    }

    async addAddress(data) {
        return (await this.api.post('/', data)).data;
    }

    async getAddressByUser() {
        return (await this.api.get('/user')).data;
    }

    async updateAddress(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async deleteAddress(id, data) {
        return (await this.api.delete(`/${id}`, data)).data;
    }
}

export const addressService = new AddressService();
