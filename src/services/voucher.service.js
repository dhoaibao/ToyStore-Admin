import createApiClient from './api.service';

class VoucherService {
    constructor(path = '/voucher') {
        this.api = createApiClient(path);
    }

    async getAllVouchers(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createVoucher(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateVoucher(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const voucherService = new VoucherService();
