import createApiClient from './api.service';

class OrderStatusService {
    constructor(path = '/order-status') {
        this.api = createApiClient(path);
    }

    async getAllOrderStatuses() {
        return (await this.api.get('/')).data;
    }

}

export const orderStatusService = new OrderStatusService();
