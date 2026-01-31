import apiClient from './api';

class CouponService {
  async getMyCoupons(filters) {
    return apiClient.get('/coupons/my-coupons', { params: filters });
  }

  async getCoupon(id) {
    return apiClient.get(`/coupons/${id}`);
  }

  async validateCoupon(couponCode, mealType, messLocation) {
    return apiClient.post('/coupons/validate', {
      couponCode,
      mealType,
      messLocation,
    });
  }

  async scanQRCode(qrData, mealType, messLocation) {
    return apiClient.post('/coupons/scan-qr', {
      qrData,
      mealType,
      messLocation,
    });
  }

  async getCouponStats() {
    return apiClient.get('/coupons/stats/usage');
  }
}

export default new CouponService();
