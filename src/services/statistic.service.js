import createApiClient from './api.service';

class StatisticService {
    constructor(path = '/statistic') {
        this.api = createApiClient(path);
    }

    async getStatistics(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }
    
    async getProducts(query) {
        const response = await this.api.get(`/products?${query}`);
        return await response.json();
    }
}

export const statisticService = new StatisticService();