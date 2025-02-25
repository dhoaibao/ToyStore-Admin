import createApiClient from './api.service';

class VoucherService {
    constructor(path = '/voucher') {
        this.api = createApiClient(path);
    }

    async getAllVouchers(query) {
        return (await this.api.get(`?${query}`)).data;
    }

    async createVoucher(data) {
        return (await this.api.post('/', data)).data;
    }

    async updateVoucher(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
}

export const voucherService = new VoucherService();
