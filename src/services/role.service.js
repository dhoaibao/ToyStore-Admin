import createApiClient from './api.service';

class RoleService {
    constructor(path = '/role') {
        this.api = createApiClient(path);
    }

    async getAllRoles(query) {
        const response = await this.api.get(`?${query}`);
        return await response.json();
    }

    async createRole(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async updateRole(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }

    async addRolePermission(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return await response.json();
    }
}

export const roleService = new RoleService();