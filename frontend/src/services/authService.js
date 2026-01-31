import apiClient from './api';

class AuthService {
  async login(email, password) {
    return apiClient.post('/auth/login', { email, password });
  }

  async register(userData) {
    return apiClient.post('/auth/register', userData);
  }

  async getProfile() {
    return apiClient.get('/auth/me');
  }

  async updateProfile(data) {
    return apiClient.put('/auth/profile', data);
  }

  async changePassword(currentPassword, newPassword) {
    return apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(resetToken, password) {
    return apiClient.post(`/auth/reset-password/${resetToken}`, { password });
  }

  async refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh-token', { refreshToken });
  }
}

export default new AuthService();
