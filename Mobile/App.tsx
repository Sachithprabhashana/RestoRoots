import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { Plus, Minus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileNavbar } from './src/components/MobileNavbar';
import { CategoryBar } from './src/components/CategoryBar';
import { MobileFooter } from './src/components/MobileFooter';
import { CartScreen } from './src/screens/CartScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { PlaceOrderScreen } from './src/screens/PlaceOrderScreen';
import { MyOrdersScreen } from './src/screens/MyOrdersScreen';
import { AdminScreen } from './src/screens/AdminScreen';

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const API_BASE_URL = 'http://192.168.8.129:4000';

const resolveFoodImageUri = (image: string | undefined, apiBaseUrl: string): string => {
  if (!image) return '';
  const trimmed = image.trim();
  const baseUrl = apiBaseUrl.replace(/\/+$/, '');

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, baseUrl);
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/images/${trimmed}`;
  return `${baseUrl}${cleanPath}`;
};

export default function App() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [token, setToken] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [screen, setScreen] = useState<
    'menu' | 'cart' | 'login' | 'place-order' | 'my-orders' | 'admin'
  >('menu');

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/food/list`)
      .then((res) => {
        if (res.data?.success) {
          setFoods(res.data.data || []);
        }
      })
      .catch(() => {
        Alert.alert('Connection Error', 'Make sure Backend is running on port 4000.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (screen === 'place-order') {
        setScreen('cart');
        return true;
      }
      if (
        screen === 'cart' ||
        screen === 'login' ||
        screen === 'my-orders' ||
        screen === 'admin'
      ) {
        setScreen('menu');
        return true;
      }
      if (isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [screen, isSearchOpen]);

  useEffect(() => {
    AsyncStorage.getItem('token').then((savedToken) => {
      if (savedToken) {
        setToken(savedToken);
      }
    });

    AsyncStorage.getItem('isAdmin').then((savedAdmin) => {
      if (savedAdmin === 'true') {
        setIsAdmin(true);
      }
    });

    AsyncStorage.getItem('cartItems').then((savedCart) => {
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch {
          setCartItems({});
        }
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of RestoRoots?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['token', 'isAdmin']);
          setToken('');
          setIsAdmin(false);
        },
      },
    ]);
  };

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(foods.map((item) => item.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return foods.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [foods, selectedCategory, searchQuery]);

  const addToCart = (id: string) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return {
        ...prev,
        [id]: current - 1,
      };
    });
  };

  const clearItemFromCart = (id: string) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0),
    [cartItems]
  );

  return (
    <SafeAreaProvider>
      {screen === 'login' ? (
        <LoginScreen
          apiBaseUrl={API_BASE_URL}
          onAuthSuccess={(newToken, adminFlag) => {
            setToken(newToken);
            setIsAdmin(adminFlag);
            setScreen('menu');
            Alert.alert('Signed In', 'You are now signed in to RestoRoots.');
          }}
          onBack={() => setScreen('menu')}
        />
      ) : screen === 'cart' ? (
        <CartScreen
          foods={foods}
          cartItems={cartItems}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClearItem={clearItemFromCart}
          onBack={() => setScreen('menu')}
          onProceedToCheckout={() => {
            if (!token) {
              setScreen('login');
            } else {
              setScreen('place-order');
            }
          }}
        />
      ) : screen === 'place-order' ? (
        <PlaceOrderScreen
          apiBaseUrl={API_BASE_URL}
          token={token}
          foods={foods}
          cartItems={cartItems}
          onBack={() => setScreen('cart')}
          onOrderPlaced={() => {
            setCartItems({});
            setScreen('my-orders');
          }}
        />
      ) : screen === 'my-orders' ? (
        <MyOrdersScreen
          apiBaseUrl={API_BASE_URL}
          token={token}
          onBack={() => setScreen('menu')}
        />
      ) : screen === 'admin' ? (
        <AdminScreen
          apiBaseUrl={API_BASE_URL}
          token={token}
          onBack={() => setScreen('menu')}
          onMenuChanged={() => {
            axios
              .get(`${API_BASE_URL}/api/food/list`)
              .then((res) => {
                if (res.data?.success) {
                  setFoods(res.data.data || []);
                }
              })
              .catch(() => { });
          }}
        />
      ) : (
        <View style={styles.container}>
          <StatusBar style="dark" />
          <MobileNavbar
            cartCount={cartCount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            onOpenCart={() => setScreen('cart')}
            isLoggedIn={Boolean(token)}
            isAdmin={isAdmin}
            onOpenLogin={() => setScreen('login')}
            onLogout={handleLogout}
            onOpenOrders={() => setScreen('my-orders')}
            onOpenAdmin={() => setScreen('admin')}
          />

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#FF4C24" />
            </View>
          ) : (
            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <CategoryBar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              }
              ListFooterComponent={
                <MobileFooter
                  onOpenMenu={() => setScreen('menu')}
                  onOpenCart={() => setScreen('cart')}
                  onOpenOrders={() => {
                    if (!token) {
                      setScreen('login');
                    } else {
                      setScreen('my-orders');
                    }
                  }}
                  isAdmin={isAdmin}
                  onOpenAdmin={() => setScreen('admin')}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No matching dishes found.</Text>
                </View>
              }
              renderItem={({ item }) => {
                const qty = cartItems[item._id] || 0;
                const imageUri = resolveFoodImageUri(item.image, API_BASE_URL);
                return (
                  <View style={styles.card}>
                    <Image
                      source={imageUri ? { uri: imageUri } : undefined}
                      style={styles.dishImage}
                      resizeMode="cover"
                      onError={(e) => {
                        console.log(
                          'Dish image error:',
                          item.name,
                          'URI:',
                          imageUri,
                          e.nativeEvent.error
                        );
                      }}
                    />
                    <View style={styles.cardBody}>
                      <View style={styles.row}>
                        <Text style={styles.dishName}>{item.name}</Text>
                        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
                      </View>
                      <Text style={styles.category}>{item.category}</Text>
                      <Text style={styles.description} numberOfLines={2}>
                        {item.description}
                      </Text>

                      <View style={styles.actionRow}>
                        {qty === 0 ? (
                          <Pressable
                            onPress={() => addToCart(item._id)}
                            style={styles.addBtn}
                          >
                            <Plus size={16} color="#ffffff" />
                            <Text style={styles.addBtnText}>Add to Cart</Text>
                          </Pressable>
                        ) : (
                          <View style={styles.stepper}>
                            <Pressable
                              onPress={() => removeFromCart(item._id)}
                              style={styles.stepperBtn}
                            >
                              <Minus size={16} color="#FF4C24" />
                            </Pressable>
                            <Text style={styles.qtyText}>{qty}</Text>
                            <Pressable
                              onPress={() => addToCart(item._id)}
                              style={styles.stepperBtn}
                            >
                              <Plus size={16} color="#FF4C24" />
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 24, gap: 14 },
  emptyBox: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#6b7280', fontSize: 14 },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  dishImage: { width: '100%', height: 170, backgroundColor: '#e5e7eb' },
  cardBody: { padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dishName: { fontSize: 17, fontWeight: '600', color: '#262626', flex: 1, marginRight: 8 },
  price: { fontSize: 16, fontWeight: '700', color: '#FF4C24' },
  category: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  description: { fontSize: 13, color: '#4b5563', marginTop: 6 },
  actionRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF4C24',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff4f2',
    borderWidth: 1,
    borderColor: '#ffd6ce',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stepperBtn: { padding: 2 },
  qtyText: { fontSize: 14, fontWeight: '700', color: '#262626' },
});