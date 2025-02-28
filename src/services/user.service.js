import createApiClient from './api.service';

class UserService {
    constructor(path = '/user') {
        this.api = createApiClient(path);
    }

    async getAllUsers(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async getLoggedInUser() {
        const response = await this.api.get('/me');
        return await response.json();
    }

    async createUser(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateProfile(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }

    async changePassword(data) {
        const response = await this.api.put('/change-password', data);
        return await response.json();
    }
}

export const userService = new UserService();
