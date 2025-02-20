import createApiClient from './api.service';

class AuthService {
    constructor(path = '/auth') {
        this.api = createApiClient(path);
    }

    async signIn(data) {
        return (await this.api.post('/sign-in', data)).data;
    }

    async signUp(data) {
        return (
            await this.api.post('/sign-up', data)).data;
    }

    async verifyEmail(data) {
        return (await this.api.post('/verify-email', data)).data;
    }

    async resendOtp(data) {
        return (await this.api.post('/resend-otp', data)).data;
    }

    async resetPassword(data) {
        return (await this.api.post('/reset-password', data)).data;
    }

    async verifyResetPassword(data) {
        return (await this.api.post('/verify-reset-password', data)).data;
    }

    async signInWithGoogle(data) {
        return (await this.api.post('/sign-in-with-google', data)).data;
    }
}

export const authService = new AuthService();
