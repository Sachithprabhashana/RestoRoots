import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react-native';

export interface CartFoodItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
}

interface CartScreenProps {
    foods: CartFoodItem[];
    cartItems: Record<string, number>;
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
    onClearItem: (id: string) => void;
    onBack: () => void;
    onProceedToCheckout: () => void;
}

const DELIVERY_FEE = 2.5;

export const CartScreen: React.FC<CartScreenProps> = ({
    foods,
    cartItems,
    onAdd,
    onRemove,
    onClearItem,
    onBack,
    onProceedToCheckout,
}) => {
    const insets = useSafeAreaInsets();

    const itemsInCart = foods.filter((food) => (cartItems[food._id] || 0) > 0);
    const subtotal = itemsInCart.reduce(
        (sum, item) => sum + Number(item.price) * (cartItems[item._id] || 0),
        0
    );
    const total = itemsInCart.length > 0 ? subtotal + DELIVERY_FEE : 0;

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
            {/* Top Bar */}
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={22} color="#262626" />
                </Pressable>
                <Text style={styles.title}>Your Cart</Text>
                <View style={{ width: 34 }} />
            </View>

            {itemsInCart.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Add delicious dishes from the RestoRoots menu to get started.
                    </Text>
                    <Pressable onPress={onBack} style={styles.browseBtn}>
                        <Text style={styles.browseBtnText}>Browse Menu</Text>
                    </Pressable>
                </View>
            ) : (
                <>
                    <FlatList
                        data={itemsInCart}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const qty = cartItems[item._id] || 0;
                            return (
                                <View style={styles.itemCard}>
                                    <Image source={{ uri: item.image }} style={styles.thumb} />
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.itemPrice}>
                                            ${(Number(item.price) * qty).toFixed(2)}
                                        </Text>

                                        <View style={styles.controlsRow}>
                                            <View style={styles.stepper}>
                                                <Pressable onPress={() => onRemove(item._id)} style={styles.stepBtn}>
                                                    <Minus size={15} color="#FF4C24" />
                                                </Pressable>
                                                <Text style={styles.qtyText}>{qty}</Text>
                                                <Pressable onPress={() => onAdd(item._id)} style={styles.stepBtn}>
                                                    <Plus size={15} color="#FF4C24" />
                                                </Pressable>
                                            </View>

                                            <Pressable onPress={() => onClearItem(item._id)} style={styles.trashBtn}>
                                                <Trash2 size={18} color="#9ca3af" />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            );
                        }}
                    />

                    {/* Summary Box */}
                    <View style={[styles.summaryBox, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery Fee</Text>
                            <Text style={styles.summaryValue}>${DELIVERY_FEE.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                        </View>

                        <Pressable onPress={onProceedToCheckout} style={styles.checkoutBtn}>
                            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                        </Pressable>
                    </View>
                </>
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
    title: { fontSize: 18, fontWeight: '700', color: '#262626' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#262626' },
    emptySubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 20,
    },
    browseBtn: {
        backgroundColor: '#FF4C24',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 999,
    },
    browseBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
    listContent: { padding: 16, gap: 12 },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 10,
        gap: 12,
        elevation: 2,
    },
    thumb: { width: 84, height: 84, borderRadius: 10, backgroundColor: '#e5e7eb' },
    itemInfo: { flex: 1, justifyContent: 'space-between' },
    itemName: { fontSize: 16, fontWeight: '600', color: '#262626' },
    itemPrice: { fontSize: 15, fontWeight: '700', color: '#FF4C24' },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff4f2',
        borderWidth: 1,
        borderColor: '#ffd6ce',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    stepBtn: { padding: 2 },
    qtyText: { fontSize: 14, fontWeight: '700', color: '#262626' },
    trashBtn: { padding: 4 },
    summaryBox: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        gap: 8,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { fontSize: 14, color: '#6b7280' },
    summaryValue: { fontSize: 14, fontWeight: '600', color: '#262626' },
    totalRow: {
        marginTop: 4,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#262626' },
    totalValue: { fontSize: 17, fontWeight: '700', color: '#FF4C24' },
    checkoutBtn: {
        marginTop: 10,
        backgroundColor: '#FF4C24',
        paddingVertical: 14,
        borderRadius: 999,
        alignItems: 'center',
    },
    checkoutBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});