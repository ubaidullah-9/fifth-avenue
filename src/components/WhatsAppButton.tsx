import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useFirebaseData } from '../FirebaseDataContext';
import { motion } from 'motion/react';

export default function WhatsAppButton() {
  const { businessDetails } = useFirebaseData();
  
  // Format phone number for WhatsApp URL (remove spaces, dashes, etc.)
  let rawPhone = businessDetails?.phone?.replace(/\D/g, '') || '';
  if (rawPhone.startsWith('0')) {
    rawPhone = '92' + rawPhone.slice(1); // Auto-format for Pakistan WhatsApp
  }
  
  // The customer message template:
  const message = encodeURIComponent("Hello! I'm interested in placing an order from your menu. Could you please help me?");

  const whatsappUrl = `https://wa.me/${rawPhone}?text=${message}`;

  if (!rawPhone) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl hover:bg-[#20bd5a] transition-colors focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Optional notification dot for visual emphasis */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-stone-950"></span>
        </span>
      </motion.a>
    </motion.div>
  );
}
