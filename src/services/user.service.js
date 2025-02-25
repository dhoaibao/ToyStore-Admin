import createApiClient from './api.service';

class UserService {
    constructor(path = '/user') {
        this.api = createApiClient(path);
    }

    async getAllUsers(query) {
        return (await this.api.get(`?${query}`)).data;
    }

    async getLoggedInUser() {
        return (await this.api.get('/me')).data;
    }

    async updateProfile(id, data) {
        return (await this.api.put(`/${id}`, data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })).data;
    }

    async changePassword(data) {
        return (await this.api.put('/change-password', data)).data;
    }
}

export const userService = new UserService();
