import createApiClient from './api.service';

class NewsService {
    constructor(path = '/news') {
        this.api = createApiClient(path);
    }

    async getAllNews(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createNews(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateNews(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const newsService = new NewsService();