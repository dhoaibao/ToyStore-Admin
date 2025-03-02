import createApiClient from './api.service';

class AuthService {
    constructor(path = '/auth') {
        this.api = createApiClient(path);
    }

    async signInAdmin(data) {
        const response = await this.api.post('/sign-in-admin', data);
        return await response.json();
    }

    async signUp(data) {
        const response = await this.api.post('/sign-up', data);
        return await response.json();
    }

    async verifyEmail(data) {
        const response = await this.api.post('/verify-email', data);
        return await response.json();
    }

    async resendOtp(data) {
        const response = await this.api.post('/resend-otp', data);
        return await response.json();
    }

    async resetPassword(data) {
        const response = await this.api.post('/reset-password', data);
        return await response.json();
    }

    async verifyResetPassword(data) {
        const response = await this.api.post('/verify-reset-password', data);
        return await response.json();
    }

    async signInWithGoogle(data) {
        const response = await this.api.post('/sign-in-with-google', data);
        return await response.json();
    }
}

export const authService = new AuthService();