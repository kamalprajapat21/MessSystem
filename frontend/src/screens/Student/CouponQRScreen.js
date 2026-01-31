import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCouponWithQR } from '../../redux/slices/couponSlice';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

const CouponQRScreen = ({ route, navigation }) => {
  const { couponId } = route.params;
  const dispatch = useDispatch();
  const { currentCoupon, qrCode, loading } = useSelector(state => state.coupon);

  useEffect(() => {
    dispatch(fetchCouponWithQR(couponId));
  }, [couponId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!currentCoupon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Coupon not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meal Coupon</Text>
          <Text style={styles.couponCode}>{currentCoupon.couponCode}</Text>
        </View>

        <View style={styles.qrContainer}>
          {qrCode ? (
            <img src={qrCode} style={styles.qrImage} alt="QR Code" />
          ) : (
            <View style={styles.qrPlaceholder}>
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={JSON.stringify({
                    couponId: currentCoupon._id,
                    couponCode: currentCoupon.couponCode,
                    userId: currentCoupon.userId,
                  })}
                  size={250}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Coupon Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Coupon Number:</Text>
            <Text style={styles.infoValue}>#{currentCoupon.couponNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {currentCoupon.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {currentCoupon.mealType && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Meal Type:</Text>
              <Text style={styles.infoValue}>
                {currentCoupon.mealType.charAt(0).toUpperCase() +
                  currentCoupon.mealType.slice(1)}
              </Text>
            </View>
          )}

          {currentCoupon.expiryDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expires On:</Text>
              <Text style={styles.infoValue}>
                {new Date(currentCoupon.expiryDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            1. Show this QR code to the mess staff
          </Text>
          <Text style={styles.instructionText}>
            2. Staff will scan the code to verify
          </Text>
          <Text style={styles.instructionText}>
            3. Enjoy your meal after verification
          </Text>
          <Text style={styles.warningText}>
            ⚠️ This coupon can only be used once
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Coupons</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.error,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  couponCode: {
    fontSize: FontSizes.lg,
    color: Colors.white,
    fontFamily: 'monospace',
  },
  qrContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  qrPlaceholder: {
    padding: Spacing.md,
  },
  qrCodeWrapper: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  infoTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  instructionsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  instructionsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  instructionText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  warningText: {
    fontSize: FontSizes.md,
    color: Colors.warning,
    marginTop: Spacing.md,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
});

export default CouponQRScreen;
