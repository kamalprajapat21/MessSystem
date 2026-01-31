import apiClient from './api';

class SubscriptionService {
  async getAllPlans() {
    return apiClient.get('/subscription-plans');
  }

  async getPlan(id) {
    return apiClient.get(`/subscription-plans/${id}`);
  }

  async createSubscription(data) {
    return apiClient.post('/subscriptions', data);
  }

  async getMySubscriptions(status) {
    const params = status ? { status } : {};
    return apiClient.get('/subscriptions/my-subscriptions', { params });
  }

  async getSubscription(id) {
    return apiClient.get(`/subscriptions/${id}`);
  }

  async cancelSubscription(id) {
    return apiClient.patch(`/subscriptions/${id}/cancel`);
  }

  async getAllSubscriptions(filters) {
    return apiClient.get('/subscriptions', { params: filters });
  }
}

export default new SubscriptionService();
