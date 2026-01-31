import React, { useEffect } from 'react';
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
import { fetchPlans } from '../../redux/slices/subscriptionSlice';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

const SubscriptionPlansScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector(state => state.subscription);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    dispatch(fetchPlans());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlans();
    setRefreshing(false);
  };

  const renderPlanItem = ({ item }) => (
    <View style={styles.planCard}>
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{item.planName}</Text>
        <Text style={styles.planPrice}>₹{item.price}</Text>
      </View>

      <Text style={styles.planDescription}>{item.description}</Text>

      <View style={styles.planDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{item.duration} days</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Coupons:</Text>
          <Text style={styles.detailValue}>{item.totalCoupons}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Meals/Day:</Text>
          <Text style={styles.detailValue}>{item.mealsPerDay}</Text>
        </View>
      </View>

      {item.features && item.features.length > 0 && (
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Features:</Text>
          {item.features.map((feature, index) => (
            <Text key={index} style={styles.featureItem}>
              ✓ {feature}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={() =>
          navigation.navigate('PurchaseSubscription', { plan: item })
        }>
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <Text style={styles.headerSubtitle}>
          Choose a plan that suits you
        </Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderPlanItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No plans available</Text>
          </View>
        }
      />
    </View>
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
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  planPrice: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  planDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  planDetails: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  featuresSection: {
    marginBottom: Spacing.md,
  },
  featuresTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  featureItem: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
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

export default SubscriptionPlansScreen;
