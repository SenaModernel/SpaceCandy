import { useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { initialProducts, initialUsers } from './src/data/seed';
import { colors } from './src/theme';
import AuthScreen from './src/screens/AuthScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ReceiptScreen from './src/screens/ReceiptScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminScreen from './src/screens/AdminScreen';
import BottomNav from './src/components/BottomNav';
import { buildOrderId } from './src/utils/format';

const customerTabs = [
  { key: 'products', label: 'Loja', icon: 'view-grid-outline' },
  { key: 'cart', label: 'Carrinho', icon: 'cart-outline' },
  { key: 'history', label: 'Historico', icon: 'clipboard-text-clock-outline' },
  { key: 'profile', label: 'Perfil', icon: 'account-circle-outline' },
];

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('products');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [receiptOrder, setReceiptOrder] = useState(null);

  const cartDetails = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const customerOrders = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return orders.filter((order) => order.customer.email === currentUser.email);
  }, [orders, currentUser]);

  const handleLogin = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (user) => user.email === normalizedEmail && user.password === password
    );

    if (!foundUser) {
      Alert.alert('Acesso nao encontrado', 'Confira e-mail e senha para continuar.');
      return;
    }

    setCurrentUser(foundUser);
    setReceiptOrder(null);
    setActiveScreen(foundUser.role === 'admin' ? 'admin' : 'products');
  };

  const handleRegister = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim() || !normalizedEmail || password.length < 4) {
      Alert.alert('Cadastro incompleto', 'Preencha nome, e-mail e uma senha com pelo menos 4 caracteres.');
      return;
    }

    const alreadyExists = users.some((user) => user.email === normalizedEmail);
    if (alreadyExists) {
      Alert.alert('E-mail ja cadastrado', 'Use outro e-mail ou entre na sua conta.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'customer',
      phone: '',
      address: '',
    };

    setUsers((current) => [...current, newUser]);
    setCurrentUser(newUser);
    setActiveScreen('products');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveScreen('products');
    setCartItems([]);
    setReceiptOrder(null);
  };

  const handleAddToCart = (productId) => {
    const product = products.find((item) => item.id === productId);
    const cartLine = cartItems.find((item) => item.productId === productId);
    const currentQuantity = cartLine?.quantity ?? 0;

    if (!product || product.stock <= currentQuantity) {
      Alert.alert('Estoque limitado', 'Nao ha mais unidades disponiveis para este item.');
      return;
    }

    setCartItems((current) => {
      const exists = current.some((item) => item.productId === productId);
      if (!exists) {
        return [...current, { productId, quantity: 1 }];
      }

      return current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const handleChangeQuantity = (productId, nextQuantity) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    if (nextQuantity <= 0) {
      setCartItems((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    if (nextQuantity > product.stock) {
      Alert.alert('Estoque limitado', `Temos ${product.stock} unidade(s) disponiveis.`);
      return;
    }

    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const handleCheckout = (checkoutData) => {
    if (!currentUser || cartDetails.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens antes de finalizar.');
      return;
    }

    const subtotal = cartDetails.reduce((sum, item) => sum + item.lineTotal, 0);
    const shipping = subtotal >= 120 ? 0 : 12.9;
    const total = subtotal + shipping;
    const createdAt = new Date().toISOString();

    const order = {
      id: buildOrderId(),
      createdAt,
      customer: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
      items: cartDetails.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        visual: item.product.visual,
        quantity: item.quantity,
        price: item.product.price,
        lineTotal: item.lineTotal,
      })),
      subtotal,
      shipping,
      total,
      status: 'Pedido confirmado',
      delivery: checkoutData.delivery,
      payment: checkoutData.payment,
    };

    setProducts((current) =>
      current.map((product) => {
        const orderedItem = cartDetails.find((item) => item.product.id === product.id);
        if (!orderedItem) {
          return product;
        }

        return {
          ...product,
          stock: Math.max(0, product.stock - orderedItem.quantity),
        };
      })
    );
    setOrders((current) => [order, ...current]);
    setCartItems([]);
    setReceiptOrder(order);
    setActiveScreen('receipt');
  };

  const handleSaveProfile = (profileData) => {
    const updatedUser = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    Alert.alert('Perfil atualizado', 'Dados salvos para o fluxo do cliente.');
  };

  const handleSaveProduct = (productData) => {
    if (!productData.name.trim() || Number.isNaN(productData.price)) {
      Alert.alert('Produto incompleto', 'Informe nome e preco valido.');
      return;
    }

    if (productData.id) {
      setProducts((current) =>
        current.map((product) =>
          product.id === productData.id ? { ...product, ...productData } : product
        )
      );
      return;
    }

    setProducts((current) => [
      {
        ...productData,
        id: `candy-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const handleRemoveProduct = (productId) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    setCartItems((current) => current.filter((item) => item.productId !== productId));
  };

  const renderCustomerScreen = () => {
    const sharedProps = {
      user: currentUser,
      products,
      cartItems,
      cartDetails,
      cartCount,
      orders: customerOrders,
      onAddToCart: handleAddToCart,
      onGoToCart: () => setActiveScreen('cart'),
      onChangeQuantity: handleChangeQuantity,
      onCheckout: () => setActiveScreen('checkout'),
      onBackToProducts: () => setActiveScreen('products'),
      onOpenReceipt: (order) => {
        setReceiptOrder(order);
        setActiveScreen('receipt');
      },
      onHistory: () => setActiveScreen('history'),
      onLogout: handleLogout,
      onSaveProfile: handleSaveProfile,
    };

    if (activeScreen === 'cart') {
      return <CartScreen {...sharedProps} />;
    }

    if (activeScreen === 'checkout') {
      return <CheckoutScreen {...sharedProps} onConfirm={handleCheckout} />;
    }

    if (activeScreen === 'receipt') {
      return (
        <ReceiptScreen
          order={receiptOrder}
          onHistory={() => setActiveScreen('history')}
          onBackToProducts={() => setActiveScreen('products')}
        />
      );
    }

    if (activeScreen === 'history') {
      return <HistoryScreen {...sharedProps} />;
    }

    if (activeScreen === 'profile') {
      return <ProfileScreen {...sharedProps} />;
    }

    return <ProductsScreen {...sharedProps} />;
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
      </SafeAreaView>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AdminScreen
          user={currentUser}
          products={products}
          onSaveProduct={handleSaveProduct}
          onRemoveProduct={handleRemoveProduct}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.app}>
        {renderCustomerScreen()}
        <BottomNav
          tabs={customerTabs}
          activeKey={activeScreen === 'receipt' || activeScreen === 'checkout' ? 'cart' : activeScreen}
          cartCount={cartCount}
          onChange={setActiveScreen}
          iconRenderer={(name, size, color) => (
            <MaterialCommunityIcons name={name} size={size} color={color} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.midnight,
  },
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
