import { motion } from 'motion/react';
import { Ticket, Flame } from 'lucide-react';
import { useFirebaseData } from '../FirebaseDataContext';

export default function Deals() {
  const { menuItems, deals, businessDetails } = useFirebaseData();

  return (
    <section id="deals" className="py-24 bg-stone-900 relative">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#FFB800] via-stone-900 to-stone-900"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-[#FFB800] uppercase mb-3 flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-[#D31027]" /> Special Offers
          </h2>
          <h3 className="text-4xl font-extrabold text-white">Exclusive Deals</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-stone-950 rounded-2xl p-1 relative overflow-hidden shadow-2xl group"
            >
              {/* Highlight background animation effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800] to-[#D31027] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

              {/* Savings Badge */}
              <div className="absolute top-0 right-0 bg-[#D31027] text-white text-xs font-black px-4 py-1.5 rounded-bl-xl z-20 uppercase tracking-wide">
                SAVE {deal.savings}
              </div>

              {/* Card Content with dashed ticket border */}
              <div className="border-2 border-dashed border-[#FFB800]/30 group-hover:border-[#FFB800]/60 rounded-xl p-8 h-full flex flex-col relative z-10 transition-colors duration-300">
                <h4 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">{deal.title}</h4>
                <p className="text-[#FFB800] font-black text-4xl mb-8 drop-shadow-md">{deal.price}</p>
                
                <ul className="text-stone-300 mb-8 flex-grow space-y-3 font-medium">
                  {deal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Ticket className="w-5 h-5 text-[#FFB800] flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full py-3.5 bg-[#FFB800] hover:bg-[#e5a600] text-stone-950 font-bold rounded-lg transition-all active:scale-95 shadow-[0_0_15px_rgba(255,184,0,0.3)] hover:shadow-[0_0_25px_rgba(255,184,0,0.5)]">
                  Claim Deal
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
