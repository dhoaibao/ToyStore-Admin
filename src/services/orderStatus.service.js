import createApiClient from './api.service';

class OrderStatusService {
    constructor(path = '/order-status') {
        this.api = createApiClient(path);
    }

    async getAllOrderStatuses() {
        const response = await this.api.get('/');
        return await response.json();
    }
}

export const orderStatusService = new OrderStatusService();
