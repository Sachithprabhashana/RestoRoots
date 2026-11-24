import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ShoppingBag, X, Package, LogIn, LogOut, ShieldCheck } from 'lucide-react-native';

interface MobileNavbarProps {
    cartCount: number;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    isSearchOpen: boolean;
    setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenCart: () => void;
    isLoggedIn: boolean;
    isAdmin: boolean;
    onOpenLogin: () => void;
    onLogout: () => void;
    onOpenOrders: () => void;
    onOpenAdmin: () => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
    cartCount,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    onOpenCart,
    isLoggedIn,
    isAdmin,
    onOpenLogin,
    onLogout,
    onOpenOrders,
    onOpenAdmin,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrapper, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
            <View style={styles.topRow}>
                <Text style={styles.logo}>RestoRoots.</Text>

                <View style={styles.actions}>
                    <Pressable
                        onPress={() => {
                            setIsSearchOpen((prev) => {
                                if (prev) setSearchQuery('');
                                return !prev;
                            });
                        }}
                        style={styles.iconBtn}
                    >
                        {isSearchOpen ? (
                            <X size={22} color="#49557e" />
                        ) : (
                            <Search size={22} color="#49557e" />
                        )}
                    </Pressable>

                    {isLoggedIn && isAdmin && (
                        <Pressable onPress={onOpenAdmin} style={styles.iconBtn}>
                            <ShieldCheck size={22} color="#FF4C24" />
                        </Pressable>
                    )}

                    {isLoggedIn && (
                        <Pressable onPress={onOpenOrders} style={styles.iconBtn}>
                            <Package size={22} color="#49557e" />
                        </Pressable>
                    )}

                    <Pressable onPress={onOpenCart} style={styles.iconBtn}>
                        <ShoppingBag size={22} color="#49557e" />
                        {cartCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </Pressable>

                    {isLoggedIn ? (
                        <Pressable onPress={onLogout} style={styles.iconBtn}>
                            <LogOut size={22} color="#49557e" />
                        </Pressable>
                    ) : (
                        <Pressable onPress={onOpenLogin} style={styles.iconBtn}>
                            <LogIn size={22} color="#49557e" />
                        </Pressable>
                    )}
                </View>
            </View>

            {isSearchOpen && (
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search dishes or category..."
                    placeholderTextColor="#9ca3af"
                    style={styles.searchInput}
                    autoFocus
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FF4C24',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBtn: {
        padding: 6,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF4C24',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },
    searchInput: {
        marginTop: 10,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        color: '#1f2937',
    },
});