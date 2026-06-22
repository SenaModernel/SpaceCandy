import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BrandHeader, Chip, IconButton, InputField, Metric, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors, radii } from '../theme';
import { formatMoney } from '../utils/format';

export default function ProductsScreen({ user, products, cartCount, onAddToCart, onGoToCart }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category)));
    return ['Todos', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'Todos' || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  return (
    <View style={styles.root}>
      <BrandHeader
        subtitle={`Ola, ${user.name}`}
        right={
          <IconButton
            icon="cart-outline"
            color={colors.surface}
            background="#25314A"
            count={cartCount}
            onPress={onGoToCart}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow="Area do cliente"
          title="Lista de produtos"
          subtitle="Catalogo de doces ficticios para simular a experiencia de compra."
        />

        <View style={styles.metricsRow}>
          <Metric label="Produtos" value={products.length} tone="berry" />
          <Metric label="Estoque" value={totalStock} tone="mint" />
          <Metric label="No carrinho" value={cartCount} tone="sky" />
        </View>

        <View style={styles.searchArea}>
          <InputField
            label="Buscar"
            icon="magnify"
            value={query}
            onChangeText={setQuery}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                active={category === item}
                onPress={() => setCategory(item)}
                color={item === 'Todos' ? colors.midnight : colors.violet}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.productList}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ProductCard({ product, onAddToCart }) {
  const disabled = product.stock === 0;

  return (
    <View style={[cardStyle, styles.productCard]}>
      <View style={[styles.visual, { backgroundColor: product.color }]}>
        <MaterialCommunityIcons name={product.visual} size={38} color={colors.surface} />
      </View>
      <View style={styles.productInfo}>
        <View style={styles.nameLine}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>
              {product.badge}
            </Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.metaLine}>
          <Text style={styles.price}>{formatMoney(product.price)}</Text>
          <Text style={[styles.stock, disabled && styles.stockEmpty]}>
            {disabled ? 'Esgotado' : `${product.stock} un.`}
          </Text>
        </View>
        <PrimaryButton
          label={disabled ? 'Indisponivel' : 'Adicionar'}
          icon="cart-plus"
          disabled={disabled}
          onPress={() => onAddToCart(product.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 24,
  },
  metricsRow: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    gap: 10,
  },
  searchArea: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 12,
  },
  chips: {
    gap: 8,
    paddingRight: 18,
  },
  productList: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 12,
  },
  productCard: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  visual: {
    width: 84,
    minHeight: 124,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productName: {
    flex: 1,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  badge: {
    maxWidth: 96,
    borderRadius: 6,
    backgroundColor: colors.softSun,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '900',
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  metaLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    color: colors.berry,
    fontSize: 18,
    fontWeight: '900',
  },
  stock: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '900',
  },
  stockEmpty: {
    color: colors.danger,
  },
});
