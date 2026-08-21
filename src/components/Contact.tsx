import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useFirebaseData } from '../FirebaseDataContext';
import { motion } from 'motion/react';

export default function Contact() {
  const { menuItems, deals, businessDetails } = useFirebaseData();

  return (
    <section id="contact" className="py-24 bg-stone-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500 via-stone-950 to-stone-950"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-[#FFB800] uppercase mb-3">Visit Us</h2>
            <h3 className="text-4xl font-extrabold text-white mb-8">Ready for a Slice?</h3>
            <p className="text-stone-300 text-lg mb-10 leading-relaxed">
              Drop by our Depalpur branch to experience our delicious range of freshly baked pizzas, or give us a call to get it delivered right to your doorstep.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                  <MapPin className="w-6 h-6 text-[#FFB800]" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Address</h4>
                  <p className="text-stone-400">{businessDetails.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                  <Phone className="w-6 h-6 text-[#FFB800]" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Phone</h4>
                  <p className="text-stone-400">{businessDetails.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                  <Clock className="w-6 h-6 text-[#FFB800]" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Hours</h4>
                  <p className="text-stone-400">{businessDetails.hours}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[500px] w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl relative bg-stone-900 flex items-center justify-center"
          >
             {/* Map Placeholder */}
             <div className="absolute inset-0 opacity-40">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                  alt="Map Placeholder" 
                  className="w-full h-full object-cover"
                />
             </div>
             <div className="relative z-10 flex flex-col items-center p-6 text-center bg-stone-950/80 backdrop-blur-sm rounded-xl border border-stone-800/50 max-w-sm">
                <MapPin className="w-12 h-12 text-[#FFB800] mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">{businessDetails.name}</h4>
                <p className="text-stone-300 text-sm mb-4">{businessDetails.address}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessDetails.name + ' ' + businessDetails.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FFB800] hover:bg-[#e5a600] text-stone-950 font-bold px-6 py-2.5 rounded-full font-medium transition-colors w-full"
                >
                  Get Directions
                </a>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
