import createApiClient from './api.service';

class PromotionService {
    constructor(path = '/discount') {
        this.api = createApiClient(path);
    }

    async getAllPromotions() {
        return (await this.api.get('/')).data;
    }
}

export const promotionService = new PromotionService();
