import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart_items';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      if (existing) {
        return prev.map((i) =>
          i.product === product._id
            ? { ...i, qty: Math.min(i.qty + qty, product.countInStock) }
            : i
        );
      }

      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: unitPrice,
          countInStock: product.countInStock,
          qty: Math.min(qty, product.countInStock),
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product === productId ? { ...i, qty: Math.max(1, Math.min(qty, i.countInStock)) } : i
      )
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product !== productId));
  };

  const clearCart = () => setItems([]);

  const itemsCount = items.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, itemsCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
