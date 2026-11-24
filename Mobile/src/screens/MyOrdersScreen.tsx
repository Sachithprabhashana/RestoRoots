import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';

interface OrderItem {
    name: string;
    quantity: number;
}

interface OrderRecord {
    _id: string;
    items: OrderItem[];
    amount: number;
    status: string;
    payment?: boolean;
    date?: string | number;
    createdAt?: string;
}

interface MyOrdersScreenProps {
    apiBaseUrl: string;
    token: string;
    onBack: () => void;
}

const getStatusColors = (status: string) => {
    const normalized = status?.toLowerCase() || '';
    if (normalized.includes('delivered')) {
        return { bg: '#ecfdf5', text: '#059669' };
    }
    if (normalized.includes('out')) {
        return { bg: '#fffbeb', text: '#d97706' };
    }
    return { bg: '#fff4f2', text: '#FF4C24' };
};

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({
    apiBaseUrl,
    token,
    onBack,
}) => {
    const insets = useSafeAreaInsets();
    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async (isPullRefresh = false) => {
        if (!token) {
            setLoading(false);
            setRefreshing(false);
            return;
        }
        if (isPullRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        try {
            const res = await axios.post(
                `${apiBaseUrl}/api/order/userorders`,
                {},
                { headers: { token } }
            );
            if (res.data?.success) {
                setOrders(res.data.data || []);
            }
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={22} color="#262626" />
                </Pressable>
                <Text style={styles.headerTitle}>My Orders</Text>
                <Pressable onPress={() => fetchOrders()} style={styles.backBtn}>
                    <RefreshCw size={20} color="#49557e" />
                </Pressable>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#FF4C24" />
                </View>
            ) : orders.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No orders found yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchOrders(true)}
                            colors={['#FF4C24']}
                            tintColor="#FF4C24"
                        />
                    }
                    renderItem={({ item }) => {
                        const badgeColors = getStatusColors(item.status);
                        const isPaid = Boolean(item.payment);
                        return (
                            <View style={styles.orderCard}>
                                <View style={styles.topRow}>
                                    <Text style={styles.itemsSummary} numberOfLines={2}>
                                        {item.items
                                            ?.map((dish) => `${dish.name} x ${dish.quantity}`)
                                            .join(', ')}
                                    </Text>
                                    <Text style={styles.amount}>
                                        ${Number(item.amount).toFixed(2)}
                                    </Text>
                                </View>

                                <View style={styles.bottomRow}>
                                    <View style={styles.metaGroup}>
                                        <Text style={styles.countText}>
                                            Items: {item.items?.length || 0}
                                        </Text>
                                        <View
                                            style={[
                                                styles.paymentBadge,
                                                isPaid ? styles.paidBadge : styles.codBadge,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.paymentText,
                                                    isPaid ? styles.paidText : styles.codText,
                                                ]}
                                            >
                                                {isPaid ? 'Paid' : 'COD / Unpaid'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: badgeColors.bg },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: badgeColors.text },
                                            ]}
                                        >
                                            ● {item.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backBtn: { padding: 6 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#262626' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 14, color: '#6b7280' },
    listContent: { padding: 16, gap: 12 },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 14,
        gap: 10,
        elevation: 2,
    },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    itemsSummary: { flex: 1, fontSize: 14, fontWeight: '600', color: '#262626' },
    amount: { fontSize: 15, fontWeight: '700', color: '#FF4C24' },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    metaGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    countText: { fontSize: 13, color: '#6b7280' },
    paymentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
    },
    paidBadge: { backgroundColor: '#eff6ff' },
    codBadge: { backgroundColor: '#f3f4f6' },
    paymentText: { fontSize: 11, fontWeight: '700' },
    paidText: { color: '#2563eb' },
    codText: { color: '#4b5563' },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    statusText: { fontSize: 12, fontWeight: '700' },
});