import { MapPin, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { motion } from 'motion/react';

export default function Features() {
  const features = [
    {
      icon: <UtensilsCrossed className="w-8 h-8 text-[#FFB800]" />,
      title: 'Dine-In',
      description: 'Enjoy a cozy and welcoming atmosphere with your friends and family at our Depalpur branch.',
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-[#FFB800]" />,
      title: 'Takeaway',
      description: 'Grab your favorite pizzas on the go. Fresh, hot, and ready when you arrive.',
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#FFB800]" />,
      title: 'Delivery',
      description: 'Late night cravings? We deliver piping hot pizzas right to your doorstep until 3 AM.',
    }
  ];

  return (
    <section className="py-20 bg-stone-950 relative -mt-10 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-stone-900 border border-stone-800 p-8 rounded-2xl text-center hover:border-[#FFB800]/50 transition-colors group cursor-pointer"
            >
              <div className="inline-flex items-center justify-center p-4 bg-stone-950 rounded-full mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-stone-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
