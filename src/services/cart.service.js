import createApiClient from './api.service';

class CartService {
    constructor(path = '/cart') {
        this.api = createApiClient(path);
    }

    async addToCart(data) {
        return (await this.api.post('/', data)).data;
    }

    async getCartByUser() {
        return (await this.api.get('/')).data;
    }

    async updateCartItem(data) {
        return (await this.api.put('/', data)).data;
    }

    async removeFromCart(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export const cartService = new CartService();
