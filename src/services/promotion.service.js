import createApiClient from './api.service';

class PromotionService {
    constructor(path = '/promotion') {
        this.api = createApiClient(path);
    }

    async getAllPromotions(query) {
        return (await this.api.get(`?${query}`)).data;
    }

    async createPromotion(data) {
        return (await this.api.post('/', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })).data;
    }

    async updatePromotion(id, data) {
        return (await this.api.put(`/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })).data;
    }
}

export const promotionService = new PromotionService();
