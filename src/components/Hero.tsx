import { motion } from 'motion/react';
import { ArrowRight, Clock } from 'lucide-react';
import { useFirebaseData } from '../FirebaseDataContext';

export default function Hero() {
  const { menuItems, deals, businessDetails } = useFirebaseData();

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20">
      {/* Background Image with Overlay */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
          alt="Fresh Pizza"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/80 to-stone-900/40"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24 pt-12">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30 text-sm font-medium mb-6"
          >
            <Clock className="w-4 h-4" />
            <span>{businessDetails.hours}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            Authentic Taste in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-[#e5a600]">{businessDetails.branch}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-300 mb-10 max-w-xl leading-relaxed"
          >
            Experience the finest pizzas loaded with premium ingredients, baked to perfection. Available for dine-in, takeaway, and late-night delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#menu"
              className="inline-flex justify-center items-center gap-2 bg-[#FFB800] hover:bg-[#e5a600] text-stone-950 font-bold px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              View Menu
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${businessDetails.phone.replace(/\\s/g, '')}`}
              className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-md transition-colors border border-white/10"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
