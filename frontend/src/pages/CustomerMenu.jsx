import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

import { useSocket } from '../context/SocketContext';
import { useCart } from '../context/CartContext';
import {
  getCategories,
  getMenuItems,
  getTableDetails,
  createOrder,
  requestTableBill
} from '../api/apiClient';
import { playOrderSuccessSound, playBillAlertSound } from '../utils/soundEffects';

import { CustomerHero } from '../components/customer/CustomerHero';
import { TableAndNameModal } from '../components/customer/TableAndNameModal';
import { CategoryChips } from '../components/customer/CategoryChips';
import { FoodCard } from '../components/customer/FoodCard';
import { ItemDetailModal } from '../components/customer/ItemDetailModal';
import { CartDrawer } from '../components/customer/CartDrawer';
import { OrderStatusBanner } from '../components/customer/OrderStatusBanner';

export const CustomerMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTableParam = searchParams.get('table');

  const { socket, joinRoom } = useSocket();
  const {
    customerName,
    saveCustomerName,
    activeTable,
    setActiveTable,
    items: cartItems,
    clearCart
  } = useCart();

  // Current active table number
  const tableNumber = activeTable || (urlTableParam ? parseInt(urlTableParam, 10) : 1);

  // Data State
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [tableStatus, setTableStatus] = useState('vacant');
  const [loading, setLoading] = useState(true);

  // UI Filters & Modals
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);

  // Open modal if table or customerName is not confirmed
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(
    !customerName || !activeTable
  );
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isRequestingBill, setIsRequestingBill] = useState(false);

  // Initialize table number if present in URL
  useEffect(() => {
    if (urlTableParam) {
      const parsed = parseInt(urlTableParam, 10);
      if (parsed > 0) {
        setActiveTable(parsed);
      }
    }
  }, [urlTableParam, setActiveTable]);

  // Fetch menu data whenever tableNumber changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, menuRes, tableRes] = await Promise.all([
          getCategories(),
          getMenuItems(),
          getTableDetails(tableNumber).catch(() => null)
        ]);

        if (catsRes?.success) setCategories(catsRes.data);
        if (menuRes?.success) setMenuItems(menuRes.data);
        if (tableRes?.success) {
          setTableStatus(tableRes.data.status);
          setActiveOrders(tableRes.data.active_orders || []);
        }
      } catch (err) {
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableNumber]);

  // Socket Room Join and Live Events
  useEffect(() => {
    if (!socket || !tableNumber) return;

    const roomName = `table_${tableNumber}`;
    joinRoom(roomName);

    // Order created ack
    socket.on('order:created', (newOrder) => {
      if (newOrder.table_number === tableNumber) {
        setActiveOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
        setTableStatus('occupied');
      }
    });

    // Order status update from Receptionist / Chef
    socket.on('order:status_update', (updatedOrder) => {
      if (updatedOrder.table_number === tableNumber) {
        setActiveOrders((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
      }
    });

    // Table status update (vacant, billing_pending, etc.)
    socket.on('table:status_update', (updatedTable) => {
      if (updatedTable.table_number === tableNumber) {
        setTableStatus(updatedTable.status);
      }
    });

    // Table bill settled / session reset
    socket.on('table:session_reset', (data) => {
      if (data.table_number === tableNumber) {
        setActiveOrders([]);
        setTableStatus('vacant');
        clearCart();
      }
    });

    return () => {
      socket.off('order:created');
      socket.off('order:status_update');
      socket.off('table:status_update');
      socket.off('table:session_reset');
    };
  }, [socket, tableNumber, joinRoom, clearCart]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory && item.category_id !== selectedCategory) {
        return false;
      }
      if (vegOnlyFilter && !item.is_veg) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, vegOnlyFilter, searchQuery]);

  // Handle Onboarding Completion
  const handleOnboardingSubmit = ({ tableNumber: newTable, customerName: newName }) => {
    setActiveTable(newTable);
    saveCustomerName(newName);
    setSearchParams({ table: newTable });
    setIsOnboardingModalOpen(false);
  };

  // Handle Order Submit
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsSubmittingOrder(true);

      const orderPayload = {
        table_number: tableNumber,
        customer_name: customerName || `Guest (Table ${tableNumber})`,
        items: cartItems.map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          special_instructions: item.special_instructions
        }))
      };

      const res = await createOrder(orderPayload);

      if (res.success) {
        // 1. Confetti burst animation
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#FFFFFF']
        });

        // 2. Play celebratory sound
        playOrderSuccessSound();

        // 3. Clear cart
        clearCart();

        // 4. Update local active orders state
        setActiveOrders((prev) => [res.data, ...prev]);
        setTableStatus('occupied');
      }
    } catch (err) {
      console.error('Failed to submit order:', err);
      alert('Could not send order to kitchen. Please try again or notify staff.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Handle Request Bill
  const handleRequestBill = async () => {
    try {
      setIsRequestingBill(true);
      await requestTableBill(tableNumber);
      setTableStatus('billing_pending');
      playBillAlertSound();
    } catch (err) {
      console.error('Failed to request bill:', err);
    } finally {
      setIsRequestingBill(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 pb-28">
      {/* Universal QR Onboarding Modal (Table & Name Selector) */}
      <TableAndNameModal
        isOpen={isOnboardingModalOpen}
        initialTable={tableNumber}
        initialName={customerName}
        onSubmit={handleOnboardingSubmit}
      />

      {/* Hero Header with Moody Backdrop & Table Switcher */}
      <CustomerHero
        tableNumber={tableNumber}
        customerName={customerName}
        onChangeNameClick={() => setIsOnboardingModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vegOnlyFilter={vegOnlyFilter}
        onVegOnlyToggle={() => setVegOnlyFilter((v) => !v)}
      />

      {/* Live Order Tracker Banner (if any active order in kitchen) */}
      <OrderStatusBanner
        activeOrders={activeOrders}
        tableStatus={tableStatus}
        onRequestBill={handleRequestBill}
        isRequestingBill={isRequestingBill}
      />

      {/* Horizontal Sticky Category Chips */}
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Food Items 2-Column Grid */}
      <main className="max-w-2xl mx-auto px-4 mt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-56 animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-sm font-semibold text-slate-300">No food items found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onOpenModal={setSelectedMenuItem}
              />
            ))}
          </div>
        )}
      </main>

      {/* Item Customization Modal (Quantity & Special Instructions) */}
      <ItemDetailModal
        item={selectedMenuItem}
        isOpen={Boolean(selectedMenuItem)}
        onClose={() => setSelectedMenuItem(null)}
      />

      {/* Sticky Bottom Floating Drawer & Order Review */}
      <CartDrawer
        tableNumber={tableNumber}
        onSubmitOrder={handlePlaceOrder}
        isSubmitting={isSubmittingOrder}
      />
    </div>
  );
};
