import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCoupons } from '../../redux/slices/couponSlice';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';
import { COUPON_STATUS, MEAL_TYPES } from '../../constants';

const CouponsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector(state => state.coupon);
  const [filter, setFilter] = useState('available');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, [filter]);

  const loadCoupons = () => {
    dispatch(fetchMyCoupons({ status: filter }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCoupons();
    setRefreshing(false);
  };

  const getMealTypeColor = mealType => {
    switch (mealType) {
      case MEAL_TYPES.BREAKFAST:
        return Colors.breakfast;
      case MEAL_TYPES.LUNCH:
        return Colors.lunch;
      case MEAL_TYPES.DINNER:
        return Colors.dinner;
      default:
        return Colors.gray;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case COUPON_STATUS.AVAILABLE:
        return Colors.success;
      case COUPON_STATUS.USED:
        return Colors.gray;
      case COUPON_STATUS.EXPIRED:
        return Colors.error;
      default:
        return Colors.warning;
    }
  };

  const renderCouponItem = ({ item }) => (
    <TouchableOpacity
      style={styles.couponCard}
      onPress={() => navigation.navigate('CouponQR', { couponId: item._id })}
      disabled={item.status !== COUPON_STATUS.AVAILABLE}>
      <View style={styles.couponHeader}>
        <View style={styles.couponNumber}>
          <Text style={styles.couponNumberText}>#{item.couponNumber}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.couponBody}>
        <Text style={styles.couponCode}>{item.couponCode}</Text>
        {item.mealType && (
          <View
            style={[
              styles.mealTypeBadge,
              { backgroundColor: getMealTypeColor(item.mealType) },
            ]}>
            <Text style={styles.mealTypeText}>
              {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
            </Text>
          </View>
        )}

        {item.status === COUPON_STATUS.USED && item.usedAt && (
          <Text style={styles.usedDate}>
            Used: {new Date(item.usedAt).toLocaleDateString()}
          </Text>
        )}

        {item.expiryDate && (
          <Text style={styles.expiryDate}>
            Expires: {new Date(item.expiryDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      {item.status === COUPON_STATUS.AVAILABLE && (
        <View style={styles.couponFooter}>
          <Text style={styles.tapText}>Tap to view QR code</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'available' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('available')}>
          <Text
            style={[
              styles.filterText,
              filter === 'available' && styles.filterTextActive,
            ]}>
            Available
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'used' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('used')}>
          <Text
            style={[
              styles.filterText,
              filter === 'used' && styles.filterTextActive,
            ]}>
            Used
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === null && styles.filterButtonActive,
          ]}
          onPress={() => setFilter(null)}>
          <Text
            style={[
              styles.filterText,
              filter === null && styles.filterTextActive,
            ]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No coupons found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: Spacing.md,
  },
  couponCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  couponNumber: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  couponNumberText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  couponBody: {
    marginBottom: Spacing.sm,
  },
  couponCode: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  mealTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  mealTypeText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  usedDate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  expiryDate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  couponFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    alignItems: 'center',
  },
  tapText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },
});

export default CouponsScreen;
