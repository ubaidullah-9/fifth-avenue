import { useState } from 'react';
import { Menu, X, Phone, ShoppingBag } from 'lucide-react';
import { useFirebaseData } from '../FirebaseDataContext';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from './BrandLogo';
import { useCart } from '../CartContext';

export default function Navbar() {
  const { businessDetails } = useFirebaseData();
  const { cartItems, setIsCartOpen } = useCart();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Deals', href: '#deals' },
    { name: 'Menu', href: '#menu' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed w-full bg-stone-900/95 backdrop-blur-md z-50 border-b border-stone-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <BrandLogo className="w-40 sm:w-48" />
          </div>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8 mr-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-stone-300 hover:text-[#FFB800] transition-colors px-3 py-2 rounded-md font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-[#FFB800] transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-stone-950 bg-[#FFB800] rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Call Now - Desktop */}
            <a
              href={`tel:${businessDetails.phone.replace(/\\s/g, '')}`}
              className="hidden md:inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e5a600] text-stone-950 font-bold px-5 py-2.5 rounded-full font-medium transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </a>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FFB800]"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-stone-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-stone-900">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-stone-300 hover:text-white hover:bg-stone-800 block px-3 py-3 rounded-md text-base font-medium"
                >
                  {link.name}
                </a>
              ))}
              <a
                href={`tel:${businessDetails.phone.replace(/\\s/g, '')}`}
                className="mt-4 flex items-center justify-center gap-2 bg-[#FFB800] text-stone-950 font-bold px-4 py-3 rounded-md font-medium w-full"
              >
                <Phone className="h-5 w-5" />
                <span>{businessDetails.phone}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
