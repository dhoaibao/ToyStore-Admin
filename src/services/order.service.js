import createApiClient from './api.service';

class OrderService {
    constructor(path = '/order') {
        this.api = createApiClient(path);
    }

    async getAllOrders(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createOrder(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async getOrderByUser(query) {
        const response = await this.api.get(`/by-user?${query}`);
        return await response.json();
    }

    async getOrderById(id) {
        const response = await this.api.get(`/${id}`);
        return await response.json();
    }

    async cancelOrder(id) {
        const response = await this.api.put(`/cancel/${id}`);
        return await response.json();
    }
}

export const orderService = new OrderService();
