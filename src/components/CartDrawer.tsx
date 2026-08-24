import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag, History, Clock } from 'lucide-react';
import { useCart } from '../CartContext';
import { useFirebaseData } from '../FirebaseDataContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

// Generate or retrieve a guest customer ID for order history
const getCustomerId = () => {
  let id = localStorage.getItem('customer_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('customer_id', id);
  }
  return id;
};

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { businessDetails } = useFirebaseData();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'history'>('cart');
  const [orderDetails, setOrderDetails] = useState({ name: '', address: '', instructions: '' });
  
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const customerId = getCustomerId();

  useEffect(() => {
    if (isCartOpen && checkoutStep === 'history') {
      const q = query(collection(db, 'orders'), where('customerId', '==', customerId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => b.createdAt - a.createdAt);
        setOrderHistory(orders);
      });
      return () => unsubscribe();
    }
  }, [isCartOpen, checkoutStep, customerId]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Firestore
    try {
      await addDoc(collection(db, 'orders'), {
        customerId,
        customerName: orderDetails.name,
        address: orderDetails.address,
        instructions: orderDetails.instructions,
        items: cartItems.map(item => ({ name: item.name, size: item.size || null, price: item.price, quantity: item.quantity })),
        total: cartTotal,
        status: 'pending',
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Error saving order:", error);
    }

    // Format WhatsApp Message
    const itemsText = cartItems.map(item => 
      `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} - Rs. ${item.price * item.quantity}`
    ).join('%0A');
    
    const message = `*New Order!*%0A%0A*Customer:* ${orderDetails.name}%0A*Address:* ${orderDetails.address}%0A*Instructions:* ${orderDetails.instructions || 'None'}%0A%0A*Order Details:*%0A${itemsText}%0A%0A*Total: Rs. ${cartTotal}*`;
    
    let rawPhone = businessDetails?.phone?.replace(/\D/g, '') || '';
    if (rawPhone.startsWith('0')) {
      rawPhone = '92' + rawPhone.slice(1); // Auto-format for Pakistan WhatsApp
    }
    const whatsappUrl = `https://wa.me/${rawPhone}?text=${message}`;
    
    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }
    
    clearCart();
    setIsCartOpen(false);
    setCheckoutStep('cart');
    setOrderDetails({ name: '', address: '', instructions: '' });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-950 border-l border-stone-800 shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-stone-800">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="text-[#FFB800]" /> {checkoutStep === 'history' ? 'History' : 'Your Order'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCheckoutStep(checkoutStep === 'history' ? 'cart' : 'history')}
                  className="p-2 hover:bg-stone-800 rounded-full transition-colors text-stone-400 hover:text-[#FFB800]"
                  title="Order History"
                >
                  <History className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-stone-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {checkoutStep === 'history' ? (
                <div className="space-y-4">
                  {orderHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-500 py-12">
                      <Clock className="w-16 h-16 mb-4 opacity-50" />
                      <p>No past orders found.</p>
                    </div>
                  ) : (
                    orderHistory.map(order => (
                      <div key={order.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-3 border-b border-stone-800 pb-3">
                          <div>
                            <p className="text-sm text-stone-400">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p className="font-bold text-[#FFB800]">Rs. {order.total}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-stone-800 text-stone-300">
                            {order.status}
                          </span>
                        </div>
                        <ul className="text-sm space-y-1">
                          {order.items.map((item: any, i: number) => (
                            <li key={i} className="text-stone-300 flex justify-between">
                              <span>{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-500">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : checkoutStep === 'cart' ? (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-stone-900 p-3 rounded-xl border border-stone-800">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-stone-800 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="text-stone-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{item.name}</h4>
                        {item.size && <p className="text-sm text-stone-400">Size: {item.size}</p>}
                        <p className="font-bold text-[#FFB800]">Rs. {item.price}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 bg-stone-950 rounded-lg border border-stone-800">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:text-[#FFB800] transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:text-[#FFB800] transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">Full Name</label>
                    <input required type="text" value={orderDetails.name} onChange={e => setOrderDetails(prev => ({...prev, name: e.target.value}))} className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-white focus:border-[#FFB800] focus:outline-none transition-colors" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">Delivery Address</label>
                    <textarea required value={orderDetails.address} onChange={e => setOrderDetails(prev => ({...prev, address: e.target.value}))} className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-white focus:border-[#FFB800] focus:outline-none transition-colors h-24" placeholder="House/Flat No, Street, Area"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">Special Instructions (Optional)</label>
                    <textarea value={orderDetails.instructions} onChange={e => setOrderDetails(prev => ({...prev, instructions: e.target.value}))} className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-white focus:border-[#FFB800] focus:outline-none transition-colors h-24" placeholder="Extra spicy, ring bell, etc."></textarea>
                  </div>
                </form>
              )}
            </div>

            {checkoutStep !== 'history' && cartItems.length > 0 && (
              <div className="p-6 border-t border-stone-800 bg-stone-950">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-400">Total Amount</span>
                  <span className="text-2xl font-black text-white">Rs. {cartTotal}</span>
                </div>
                {checkoutStep === 'cart' ? (
                  <button 
                    onClick={() => setCheckoutStep('details')}
                    className="w-full py-4 bg-[#FFB800] hover:bg-[#e5a600] text-stone-950 font-bold rounded-xl transition-colors text-lg"
                  >
                    Checkout Details
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-6 py-4 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-white font-bold rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      form="checkout-form"
                      type="submit"
                      className="flex-1 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors text-lg flex justify-center items-center gap-2"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      Order on WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
