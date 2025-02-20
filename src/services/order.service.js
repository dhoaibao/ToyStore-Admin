import createApiClient from './api.service';

class OrderService {
    constructor(path = '/order') {
        this.api = createApiClient(path);
    }

    async createOrder(data) {
        return (await this.api.post('/', data)).data;
    }

    async getOrderByUser(query) {
        return (await this.api.get(`/by-user?${query}`)).data;
    }

    async getOrderById(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async cancelOrder(id) {
        return (await this.api.put(`/cancel/${id}`)).data;
    }
}

export const orderService = new OrderService();
