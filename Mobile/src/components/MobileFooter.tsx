import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { UtensilsCrossed, ShoppingBag, ClipboardList, ShieldCheck } from 'lucide-react-native';

interface MobileFooterProps {
    onOpenMenu: () => void;
    onOpenCart: () => void;
    onOpenOrders: () => void;
    isAdmin?: boolean;
    onOpenAdmin?: () => void;
}

export const MobileFooter: React.FC<MobileFooterProps> = ({
    onOpenMenu,
    onOpenCart,
    onOpenOrders,
    isAdmin = false,
    onOpenAdmin,
}) => {
    return (
        <View style={styles.footer}>
            <View style={styles.brandRow}>
                <UtensilsCrossed size={18} color="#FF4C24" />
                <Text style={styles.brandText}>RestoRoots.</Text>
            </View>

            <Text style={styles.tagline}>
                Freshly prepared dishes delivered fast to your door.
            </Text>

            <View style={styles.linksRow}>
                <Pressable onPress={onOpenMenu} style={styles.linkBtn}>
                    <Text style={styles.linkText}>Menu</Text>
                </Pressable>

                <Pressable onPress={onOpenCart} style={styles.linkBtn}>
                    <ShoppingBag size={14} color="#4b5563" />
                    <Text style={styles.linkText}>Cart</Text>
                </Pressable>

                <Pressable onPress={onOpenOrders} style={styles.linkBtn}>
                    <ClipboardList size={14} color="#4b5563" />
                    <Text style={styles.linkText}>My Orders</Text>
                </Pressable>

                {isAdmin && onOpenAdmin && (
                    <Pressable onPress={onOpenAdmin} style={styles.linkBtn}>
                        <ShieldCheck size={14} color="#FF4C24" />
                        <Text style={[styles.linkText, styles.adminLinkText]}>Admin</Text>
                    </Pressable>
                )}
            </View>

            <View style={styles.divider} />

            <Text style={styles.copyright}>
                © {new Date().getFullYear()} RestoRoots. All rights reserved.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        marginTop: 12,
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 18,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        alignItems: 'center',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    brandText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FF4C24',
    },
    tagline: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 18,
    },
    linksRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 14,
        marginTop: 14,
    },
    linkBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    linkText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    adminLinkText: {
        color: '#FF4C24',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 14,
    },
    copyright: {
        fontSize: 11,
        color: '#9ca3af',
        textAlign: 'center',
    },
});