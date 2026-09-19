import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [activeTable, setActiveTable] = useState(null);

  // Load customer name and active table from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('qr_customer_name');
    if (savedName) setCustomerName(savedName);
  }, []);

  const saveCustomerName = (name) => {
    const cleanName = name?.trim() || '';
    setCustomerName(cleanName);
    if (cleanName) {
      localStorage.setItem('qr_customer_name', cleanName);
    }
  };

  /**
   * Add item to cart with quantity and optional special instructions.
   * If an item with identical id AND identical special_instructions already exists, increment quantity.
   */
  const addItem = (menuItem, quantity = 1, special_instructions = '') => {
    const cleanInstructions = special_instructions ? special_instructions.trim() : '';

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.item_id === menuItem.id && (i.special_instructions || '') === cleanInstructions
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          cart_id: `${menuItem.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          item_id: menuItem.id,
          item_name: menuItem.name,
          unit_price: menuItem.price,
          quantity: Math.max(1, quantity),
          special_instructions: cleanInstructions,
          image_url: menuItem.image_url,
          is_veg: menuItem.is_veg,
          category_id: menuItem.category_id
        }
      ];
    });
  };

  const updateQuantity = (cart_id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(cart_id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cart_id === cart_id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (cart_id) => {
    setItems((prev) => prev.filter((item) => item.cart_id !== cart_id));
  };

  const updateInstructions = (cart_id, instructions) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cart_id === cart_id ? { ...item, special_instructions: instructions } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        customerName,
        activeTable,
        setActiveTable,
        saveCustomerName,
        addItem,
        updateQuantity,
        removeItem,
        updateInstructions,
        clearCart,
        totalItemsCount,
        subtotal,
        tax,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
