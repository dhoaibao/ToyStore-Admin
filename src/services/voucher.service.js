import createApiClient from './api.service';

class VoucherService {
    constructor(path = '/voucher') {
        this.api = createApiClient(path);
    }

    async getAllVouchers() {
        return (await this.api.get('?limit=-1&status=valid')).data;
    }

    async collectVoucher(id) {
        return (await this.api.post(`/collect/${id}`)).data;
    }

    async getVoucherByUser() {
        return (await this.api.get('/by-user')).data;
    }

    async getVoucherById(id) {
        return (await this.api.get(`/${id}`)).data;
    }
}

export const voucherService = new VoucherService();
