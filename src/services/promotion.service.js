import createApiClient from './api.service';

class PromotionService {
    constructor(path = '/promotion') {
        this.api = createApiClient(path);
    }

    async getAllPromotions(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createPromotion(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updatePromotion(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const promotionService = new PromotionService();
