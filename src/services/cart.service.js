import createApiClient from './api.service';

class CartService {
    constructor(path = '/cart') {
        this.api = createApiClient(path);
    }

    async addToCart(data) {
        const response = await this.api.post('/', data);
        return await response.json();
    }

    async getCartByUser() {
        const response = await this.api.get('/');
        return await response.json();
    }

    async updateCartItem(data) {
        const response = await this.api.put('/', data);
        return await response.json();
    }

    async removeFromCart(id) {
        const response = await this.api.delete(`/${id}`);
        return await response.json();
    }
}

export const cartService = new CartService();
