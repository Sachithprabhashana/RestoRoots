import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    ScrollView,
    Image,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ArrowLeft, Trash2, PlusCircle, ImagePlus } from 'lucide-react-native';

interface AdminOrderItem {
    name: string;
    quantity: number;
}

interface AdminOrderAddress {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    phone?: string;
}

interface AdminOrder {
    _id: string;
    items: AdminOrderItem[];
    amount: number;
    address?: AdminOrderAddress;
    payment?: boolean;
    status: string;
}

interface AdminFoodItem {
    _id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

interface AdminScreenProps {
    apiBaseUrl: string;
    token: string;
    onBack: () => void;
    onMenuChanged?: () => void;
}

const ORDER_STATUSES = ['Food Processing', 'Out for delivery', 'Delivered'];
const DEFAULT_CATEGORIES = [
    'Salad',
    'Rolls',
    'Deserts',
    'Sandwich',
    'Cake',
    'Pure Veg',
    'Pasta',
    'Noodles',
];

export const AdminScreen: React.FC<AdminScreenProps> = ({
    apiBaseUrl,
    token,
    onBack,
    onMenuChanged,
}) => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'add'>('orders');

    // Orders state
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
    const [refreshingOrders, setRefreshingOrders] = useState<boolean>(false);

    // Menu state
    const [foods, setFoods] = useState<AdminFoodItem[]>([]);
    const [loadingFoods, setLoadingFoods] = useState<boolean>(true);

    // Add dish state
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<string>('Salad');
    const [imageUri, setImageUri] = useState<string>('');
    const [uploadingDish, setUploadingDish] = useState<boolean>(false);

    const availableCategories = useMemo(() => {
        const dynamicCats = foods.map((f) => f.category).filter(Boolean);
        return Array.from(new Set([...DEFAULT_CATEGORIES, ...dynamicCats]));
    }, [foods]);

    const fetchOrders = async (isPullRefresh = false) => {
        if (isPullRefresh) {
            setRefreshingOrders(true);
        } else {
            setLoadingOrders(true);
        }
        try {
            const res = await axios.get(`${apiBaseUrl}/api/order/list`, {
                headers: { token },
            });
            if (res.data?.success) {
                setOrders(res.data.data || []);
            }
        } catch (err: any) {
            Alert.alert(
                'Orders Error',
                err?.response?.data?.message || 'Could not load orders.'
            );
        } finally {
            setLoadingOrders(false);
            setRefreshingOrders(false);
        }
    };

    const fetchFoods = async () => {
        setLoadingFoods(true);
        try {
            const res = await axios.get(`${apiBaseUrl}/api/food/list`);
            if (res.data?.success) {
                setFoods(res.data.data || []);
            }
        } catch {
            setFoods([]);
        } finally {
            setLoadingFoods(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchFoods();
    }, [token]);

    const handleStatusChange = async (orderId: string, nextStatus: string) => {
        try {
            const res = await axios.post(
                `${apiBaseUrl}/api/order/status`,
                { orderId, status: nextStatus },
                { headers: { token } }
            );
            if (res.data?.success) {
                setOrders((prev) =>
                    prev.map((ord) =>
                        ord._id === orderId ? { ...ord, status: nextStatus } : ord
                    )
                );
            } else {
                Alert.alert('Update Failed', res.data?.message || 'Could not update status.');
            }
        } catch (err: any) {
            Alert.alert(
                'Error',
                err?.response?.data?.message || 'Failed to update order status.'
            );
        }
    };

    const handleDeleteFood = (foodId: string, foodName: string) => {
        Alert.alert('Delete Dish', `Remove "${foodName}" from the menu?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const res = await axios.post(
                            `${apiBaseUrl}/api/food/remove`,
                            { id: foodId },
                            { headers: { token } }
                        );
                        if (res.data?.success) {
                            setFoods((prev) => prev.filter((f) => f._id !== foodId));
                            onMenuChanged?.();
                        } else {
                            Alert.alert(
                                'Delete Failed',
                                res.data?.message || 'Could not remove dish.'
                            );
                        }
                    } catch (err: any) {
                        Alert.alert(
                            'Error',
                            err?.response?.data?.message || 'Could not remove dish.'
                        );
                    }
                },
            },
        ]);
    };

    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission Needed', 'Allow photo library access to pick a dish image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleAddDish = async () => {
        const numericPrice = Number(price);
        if (
            !name.trim() ||
            !description.trim() ||
            !category.trim() ||
            !price.trim() ||
            Number.isNaN(numericPrice) ||
            numericPrice <= 0
        ) {
            Alert.alert('Invalid Details', 'Enter name, description, category, and valid price.');
            return;
        }

        if (!imageUri) {
            Alert.alert('Missing Image', 'Please select a dish image first.');
            return;
        }

        setUploadingDish(true);
        try {
            const filename = imageUri.split('/').pop() || 'dish.jpg';
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('price', String(numericPrice));
            formData.append('category', category.trim());
            formData.append('image', {
                uri: imageUri,
                name: filename,
                type: 'image/jpeg',
            } as any);

            const res = await axios.post(`${apiBaseUrl}/api/food/add`, formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data?.success) {
                Alert.alert('Dish Added', `${name.trim()} is now live on RestoRoots.`);
                setName('');
                setDescription('');
                setPrice('');
                setImageUri('');
                await fetchFoods();
                onMenuChanged?.();
                setActiveTab('menu');
            } else {
                Alert.alert('Upload Failed', res.data?.message || 'Could not add dish.');
            }
        } catch (err: any) {
            Alert.alert(
                'Upload Error',
                err?.response?.data?.message || 'Failed to upload dish to backend.'
            );
        } finally {
            setUploadingDish(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.iconBtn}>
                    <ArrowLeft size={22} color="#262626" />
                </Pressable>
                <Text style={styles.headerTitle}>Admin Console</Text>
                <View style={{ width: 34 }} />
            </View>

            <View style={styles.tabBar}>
                <Pressable
                    onPress={() => setActiveTab('orders')}
                    style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'orders' && styles.tabTextActive,
                        ]}
                    >
                        Orders ({orders.length})
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setActiveTab('menu')}
                    style={[styles.tabBtn, activeTab === 'menu' && styles.tabBtnActive]}
                >
                    <Text
                        style={[styles.tabText, activeTab === 'menu' && styles.tabTextActive]}
                    >
                        Menu ({foods.length})
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setActiveTab('add')}
                    style={[styles.tabBtn, activeTab === 'add' && styles.tabBtnActive]}
                >
                    <Text
                        style={[styles.tabText, activeTab === 'add' && styles.tabTextActive]}
                    >
                        + Add Dish
                    </Text>
                </Pressable>
            </View>

            {activeTab === 'orders' ? (
                loadingOrders ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#FF4C24" />
                    </View>
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshingOrders}
                                onRefresh={() => fetchOrders(true)}
                                colors={['#FF4C24']}
                                tintColor="#FF4C24"
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <Text style={styles.muted}>No orders found.</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.rowBetween}>
                                    <Text style={styles.boldTitle}>
                                        {item.address?.firstName || 'Customer'}{' '}
                                        {item.address?.lastName || ''}
                                    </Text>
                                    <Text style={styles.price}>
                                        ${Number(item.amount).toFixed(2)}
                                    </Text>
                                </View>

                                <Text style={styles.itemSummary}>
                                    {item.items
                                        ?.map((d) => `${d.name} x ${d.quantity}`)
                                        .join(', ')}
                                </Text>

                                {item.address?.street ? (
                                    <Text style={styles.muted}>
                                        {item.address.street}, {item.address.city || ''}
                                        {item.address.phone ? ` • ${item.address.phone}` : ''}
                                    </Text>
                                ) : null}

                                <View style={styles.rowBetween}>
                                    <Text style={styles.paymentLabel}>
                                        {item.payment ? 'Paid (Card)' : 'COD / Unpaid'}
                                    </Text>
                                    <Text style={styles.currentStatus}>● {item.status}</Text>
                                </View>

                                <View style={styles.statusRow}>
                                    {ORDER_STATUSES.map((st) => {
                                        const active = item.status === st;
                                        return (
                                            <Pressable
                                                key={st}
                                                onPress={() => handleStatusChange(item._id, st)}
                                                style={[
                                                    styles.statusChip,
                                                    active && styles.statusChipActive,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.statusChipText,
                                                        active && styles.statusChipTextActive,
                                                    ]}
                                                >
                                                    {st}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                    />
                )
            ) : activeTab === 'menu' ? (
                loadingFoods ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#FF4C24" />
                    </View>
                ) : (
                    <FlatList
                        data={foods}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <View style={styles.foodRowCard}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.thumbImage}
                                />
                                <View style={styles.foodInfo}>
                                    <Text style={styles.boldTitle} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.muted}>
                                        {item.category} • ${Number(item.price).toFixed(2)}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => handleDeleteFood(item._id, item.name)}
                                    style={styles.deleteBtn}
                                >
                                    <Trash2 size={18} color="#dc2626" />
                                </Pressable>
                            </View>
                        )}
                    />
                )
            ) : (
                <KeyboardAvoidingView
                    style={styles.flexOne}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={24}
                >
                    <ScrollView
                        contentContainerStyle={styles.addScrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>New Dish Details</Text>

                            <Pressable onPress={handlePickImage} style={styles.pickerBox}>
                                {imageUri ? (
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={styles.previewImage}
                                    />
                                ) : (
                                    <View style={styles.pickerPlaceholder}>
                                        <ImagePlus size={28} color="#FF4C24" />
                                        <Text style={styles.pickerText}>
                                            Tap to choose dish photo
                                        </Text>
                                    </View>
                                )}
                            </Pressable>

                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Dish name"
                                placeholderTextColor="#9ca3af"
                                style={styles.input}
                            />

                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Short description"
                                placeholderTextColor="#9ca3af"
                                multiline
                                style={[styles.input, styles.textArea]}
                            />

                            <Text style={styles.label}>Category</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.categoryList}
                            >
                                {availableCategories.map((cat) => {
                                    const selected = category === cat;
                                    return (
                                        <Pressable
                                            key={cat}
                                            onPress={() => setCategory(cat)}
                                            style={[
                                                styles.categoryChip,
                                                selected && styles.categoryChipActive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryChipText,
                                                    selected && styles.categoryChipTextActive,
                                                ]}
                                            >
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>

                            <Text style={styles.label}>Price ($)</Text>
                            <TextInput
                                value={price}
                                onChangeText={setPrice}
                                placeholder="e.g. 12.99"
                                placeholderTextColor="#9ca3af"
                                keyboardType="decimal-pad"
                                returnKeyType="done"
                                style={styles.input}
                            />

                            <Pressable
                                onPress={handleAddDish}
                                disabled={uploadingDish}
                                style={[
                                    styles.submitBtn,
                                    uploadingDish && styles.disabledBtn,
                                ]}
                            >
                                {uploadingDish ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <View style={styles.submitInner}>
                                        <PlusCircle size={18} color="#ffffff" />
                                        <Text style={styles.submitText}>Add Dish</Text>
                                    </View>
                                )}
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    flexOne: { flex: 1 },
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
    iconBtn: { padding: 6 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#262626' },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 999,
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
    },
    tabBtnActive: { backgroundColor: '#FF4C24' },
    tabText: { fontSize: 12, fontWeight: '700', color: '#4b5563' },
    tabTextActive: { color: '#ffffff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    listContent: { padding: 16, gap: 12, paddingBottom: 32 },
    addScrollContent: { padding: 16, gap: 12, paddingBottom: 240 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 14,
        gap: 10,
        elevation: 2,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#262626' },
    label: { fontSize: 13, fontWeight: '600', color: '#374151' },
    categoryList: { gap: 8, paddingVertical: 4 },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    categoryChipActive: {
        backgroundColor: '#fff4f2',
        borderColor: '#FF4C24',
    },
    categoryChipText: { fontSize: 12, fontWeight: '600', color: '#4b5563' },
    categoryChipTextActive: { color: '#FF4C24', fontWeight: '700' },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    boldTitle: { fontSize: 15, fontWeight: '700', color: '#262626' },
    price: { fontSize: 15, fontWeight: '700', color: '#FF4C24' },
    itemSummary: { fontSize: 13, fontWeight: '600', color: '#374151' },
    muted: { fontSize: 12, color: '#6b7280' },
    paymentLabel: { fontSize: 12, fontWeight: '700', color: '#2563eb' },
    currentStatus: { fontSize: 12, fontWeight: '700', color: '#FF4C24' },
    statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
    statusChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#f3f4f6',
    },
    statusChipActive: { backgroundColor: '#fff4f2', borderWidth: 1, borderColor: '#FF4C24' },
    statusChipText: { fontSize: 11, fontWeight: '600', color: '#4b5563' },
    statusChipTextActive: { color: '#FF4C24', fontWeight: '700' },
    foodRowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 10,
        gap: 12,
        elevation: 2,
    },
    thumbImage: { width: 58, height: 58, borderRadius: 10, backgroundColor: '#e5e7eb' },
    foodInfo: { flex: 1, gap: 2 },
    deleteBtn: { padding: 8 },
    pickerBox: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
    },
    pickerPlaceholder: {
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    pickerText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
    previewImage: { width: '100%', height: 160 },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1f2937',
        backgroundColor: '#f9fafb',
    },
    textArea: { height: 76, textAlignVertical: 'top' },
    submitBtn: {
        marginTop: 4,
        backgroundColor: '#FF4C24',
        paddingVertical: 14,
        borderRadius: 999,
        alignItems: 'center',
    },
    disabledBtn: { opacity: 0.7 },
    submitInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    submitText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});