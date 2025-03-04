import createApiClient from './api.service';

class ReviewService {
    constructor(path = '/review') {
        this.api = createApiClient(path);
    }

    async getAllReviews(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createReview(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async deleteReview(id) {
        const response = await this.api.delete(`/${id}`);
        return await response.json();
    }
}

export const reviewService = new ReviewService();