import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import couponService from '../../services/couponService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';
import { MEAL_TYPES } from '../../constants';
import Toast from 'react-native-toast-message';

const ScannerScreen = () => {
  const [manualCode, setManualCode] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(MEAL_TYPES.LUNCH);
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  const handleManualValidation = async () => {
    if (!manualCode.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter coupon code',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await couponService.validateCoupon(
        manualCode.trim(),
        selectedMeal,
        'Main Mess'
      );

      setLastScan({
        student: response.data.student,
        coupon: response.data.coupon,
        success: true,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Coupon validated successfully',
      });

      setManualCode('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Validation Failed',
        text2: error.message || 'Invalid coupon code',
      });
    } finally {
      setLoading(false);
    }
  };

  // In a real app, this would use react-native-camera for QR scanning
  const handleQRScan = async qrData => {
    setLoading(true);
    try {
      const response = await couponService.scanQRCode(
        qrData,
        selectedMeal,
        'Main Mess'
      );

      setLastScan({
        student: response.data.student,
        coupon: response.data.coupon,
        subscription: response.data.subscription,
        success: true,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'QR code scanned successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Scan Failed',
        text2: error.message || 'Invalid QR code',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coupon Scanner</Text>
        <Text style={styles.subtitle}>Scan or enter coupon code</Text>
      </View>

      {/* Meal Type Selection */}
      <View style={styles.mealSelector}>
        <Text style={styles.sectionTitle}>Select Meal Type:</Text>
        <View style={styles.mealButtons}>
          {Object.values(MEAL_TYPES).map(meal => (
            <TouchableOpacity
              key={meal}
              style={[
                styles.mealButton,
                selectedMeal === meal && styles.mealButtonActive,
              ]}
              onPress={() => setSelectedMeal(meal)}>
              <Text
                style={[
                  styles.mealButtonText,
                  selectedMeal === meal && styles.mealButtonTextActive,
                ]}>
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* QR Scanner Placeholder */}
      <View style={styles.scannerSection}>
        <View style={styles.scannerPlaceholder}>
          <Text style={styles.scannerText}>📷</Text>
          <Text style={styles.scannerSubtext}>QR Scanner</Text>
          <Text style={styles.note}>
            Camera integration required for QR scanning
          </Text>
        </View>
      </View>

      {/* Manual Entry */}
      <View style={styles.manualSection}>
        <Text style={styles.sectionTitle}>Manual Entry:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Coupon Code"
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.validateButton}
            onPress={handleManualValidation}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.validateButtonText}>Validate</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Last Scan Result */}
      {lastScan && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Last Scan Result</Text>
          <View style={styles.resultContent}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Student:</Text>
              <Text style={styles.resultValue}>
                {lastScan.student.fullName}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>ID:</Text>
              <Text style={styles.resultValue}>
                {lastScan.student.studentId}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Coupon:</Text>
              <Text style={styles.resultValue}>
                {lastScan.coupon.couponCode}
              </Text>
            </View>
            {lastScan.subscription && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Remaining:</Text>
                <Text style={styles.resultValue}>
                  {lastScan.subscription.remainingCoupons} coupons
                </Text>
              </View>
            )}
            <View style={styles.successBadge}>
              <Text style={styles.successText}>✓ Verified</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  mealSelector: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  mealButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mealButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  mealButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mealButtonText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  mealButtonTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  scannerSection: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  scannerPlaceholder: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  scannerText: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  scannerSubtext: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  note: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  manualSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    marginRight: Spacing.md,
  },
  validateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  validateButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  resultTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  resultContent: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  resultLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  resultValue: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  successBadge: {
    backgroundColor: Colors.success,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  successText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
});

export default ScannerScreen;
