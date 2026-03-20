import { getPrimaryProductImage } from "@/data/products";

const CART_STORAGE_KEY = "uzebless-cart";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartProductInput {
  id: string;
  name: string;
  price: string;
  images?: string[];
}

const isBrowser = () => typeof window !== "undefined";

const readCartItems = (): CartItem[] => {
  if (!isBrowser()) return [];

  try {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawCart) return [];

    const parsedCart = JSON.parse(rawCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("[Cart] Erro ao ler carrinho:", error);
    return [];
  }
};

const persistCartItems = (items: CartItem[]) => {
  if (!isBrowser()) return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const parseBRLValue = (price: string) => {
  const normalizedValue = price.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(normalizedValue) || 0;
};

export const formatCartTotal = (items: CartItem[]) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(
    items.reduce((total, item) => total + parseBRLValue(item.price) * item.quantity, 0),
  );

export const getCartItems = () => readCartItems();

export const addProductToCart = (product: CartProductInput) => {
  const cartItems = readCartItems();
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    const updatedCart = cartItems.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );

    persistCartItems(updatedCart);
    return updatedCart;
  }

  const newItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: getPrimaryProductImage(product.images),
    quantity: 1,
  };

  const updatedCart = [...cartItems, newItem];
  persistCartItems(updatedCart);
  return updatedCart;
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
  const sanitizedQuantity = Math.max(1, quantity);
  const updatedCart = readCartItems().map((item) =>
    item.id === productId ? { ...item, quantity: sanitizedQuantity } : item,
  );

  persistCartItems(updatedCart);
  return updatedCart;
};

export const removeCartItem = (productId: string) => {
  const updatedCart = readCartItems().filter((item) => item.id !== productId);
  persistCartItems(updatedCart);
  return updatedCart;
};

export const clearCart = () => {
  persistCartItems([]);
};

export const buildCartWhatsappMessage = (items: CartItem[]) => {
  const lines = items.map(
    (item) => `- ${item.name} | Qtd: ${item.quantity} | ${item.price}`,
  );

  return encodeURIComponent(
    [
      "Olá! Quero finalizar meu pedido com estes produtos:",
      "",
      ...lines,
      "",
      `Total: ${formatCartTotal(items)}`,
    ].join("\n"),
  );
};
