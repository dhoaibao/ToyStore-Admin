import createApiClient from './api.service';

class MessageService {
    constructor(path = '/message') {
        this.api = createApiClient(path);
    }

    async getConversations() {
        const response = await this.api.get('/conversations');
        return await response.json();
    }

    async getMessages(id) {
        const response = await this.api.get(`/${id}`);
        return await response.json();
    }

}

export const messageService = new MessageService();