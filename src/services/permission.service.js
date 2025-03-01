import createApiClient from './api.service';

class PermissionService {
    constructor(path = '/permission') {
        this.api = createApiClient(path);
    }

    async getAllPermissions(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createPermission(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updatePermission(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const permissionService = new PermissionService();