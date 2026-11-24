import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react-native';
import { CartFoodItem } from './CartScreen';

interface PlaceOrderScreenProps {
    apiBaseUrl: string;
    token: string;
    foods: CartFoodItem[];
    cartItems: Record<string, number>;
    onBack: () => void;
    onOrderPlaced: () => void;
}

const DELIVERY_FEE = 2.5;

export const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({
    apiBaseUrl,
    token,
    foods,
    cartItems,
    onBack,
    onOrderPlaced,
}) => {
    const insets = useSafeAreaInsets();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
    const [submitting, setSubmitting] = useState(false);

    const orderItems = foods
        .filter((food) => (cartItems[food._id] || 0) > 0)
        .map((food) => ({
            _id: food._id,
            name: food.name,
            price: Number(food.price),
            quantity: cartItems[food._id],
        }));

    const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalAmount = subtotal + DELIVERY_FEE;

    const handlePlaceOrder = async () => {
        if (orderItems.length === 0) {
            Alert.alert('Empty Cart', 'Add at least one dish before placing an order.');
            return;
        }

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !street.trim() ||
            !city.trim() ||
            !phone.trim()
        ) {
            Alert.alert('Missing Details', 'Please fill in all delivery address fields.');
            return;
        }

        setSubmitting(true);
        try {
            const address = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                street: street.trim(),
                city: city.trim(),
                phone: phone.trim(),
            };

            const res = await axios.post(
                `${apiBaseUrl}/api/order/place`,
                {
                    items: orderItems,
                    amount: totalAmount,
                    address,
                    paymentMethod,
                    clientType: 'mobile',
                },
                {
                    headers: { token },
                }
            );

            if (res.data?.success) {
                if (paymentMethod === 'stripe' && res.data?.session_url) {
                    await Linking.openURL(res.data.session_url);
                    onOrderPlaced();
                } else {
                    Alert.alert(
                        'Order Placed',
                        'Your RestoRoots order has been submitted!'
                    );
                    onOrderPlaced();
                }
            } else {
                Alert.alert(
                    'Order Failed',
                    res.data?.message || 'Could not place your order.'
                );
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                'Could not reach /api/order/place. Check your backend route and token.';
            Alert.alert('Error', msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={22} color="#262626" />
                </Pressable>
                <Text style={styles.headerTitle}>Delivery Details</Text>
                <View style={{ width: 34 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Contact & Address</Text>

                    <View style={styles.rowInputs}>
                        <TextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="First name"
                            placeholderTextColor="#9ca3af"
                            style={[styles.input, styles.halfInput]}
                        />
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Last name"
                            placeholderTextColor="#9ca3af"
                            style={[styles.input, styles.halfInput]}
                        />
                    </View>

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email address"
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <TextInput
                        value={street}
                        onChangeText={setStreet}
                        placeholder="Street address"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                    />

                    <TextInput
                        value={city}
                        onChangeText={setCity}
                        placeholder="City"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                    />

                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Phone number"
                        placeholderTextColor="#9ca3af"
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentRow}>
                        <Pressable
                            onPress={() => setPaymentMethod('cod')}
                            style={[
                                styles.paymentOption,
                                paymentMethod === 'cod' && styles.paymentOptionActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.paymentText,
                                    paymentMethod === 'cod' && styles.paymentTextActive,
                                ]}
                            >
                                Cash on Delivery
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setPaymentMethod('stripe')}
                            style={[
                                styles.paymentOption,
                                paymentMethod === 'stripe' && styles.paymentOptionActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.paymentText,
                                    paymentMethod === 'stripe' && styles.paymentTextActive,
                                ]}
                            >
                                Card (Stripe)
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.muted}>Subtotal</Text>
                        <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.muted}>Delivery Fee</Text>
                        <Text style={styles.value}>${DELIVERY_FEE.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                    </View>

                    <Pressable
                        onPress={handlePlaceOrder}
                        disabled={submitting}
                        style={[styles.placeBtn, submitting && styles.disabledBtn]}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.placeBtnText}>
                                {paymentMethod === 'stripe'
                                    ? 'Continue to Stripe'
                                    : 'Place Order'}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    scrollContent: { padding: 16, gap: 14, paddingBottom: 32 },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        gap: 12,
        elevation: 2,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#262626' },
    rowInputs: { flexDirection: 'row', gap: 10 },
    halfInput: { flex: 1 },
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
    paymentRow: { flexDirection: 'row', gap: 10 },
    paymentOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        alignItems: 'center',
    },
    paymentOptionActive: {
        borderColor: '#FF4C24',
        backgroundColor: '#fff4f2',
    },
    paymentText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4b5563',
    },
    paymentTextActive: {
        color: '#FF4C24',
        fontWeight: '700',
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    muted: { fontSize: 14, color: '#6b7280' },
    value: { fontSize: 14, fontWeight: '600', color: '#262626' },
    totalRow: {
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#262626' },
    totalValue: { fontSize: 17, fontWeight: '700', color: '#FF4C24' },
    placeBtn: {
        marginTop: 6,
        backgroundColor: '#FF4C24',
        paddingVertical: 14,
        borderRadius: 999,
        alignItems: 'center',
    },
    disabledBtn: { opacity: 0.7 },
    placeBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});