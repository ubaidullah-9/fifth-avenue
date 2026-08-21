import { menuCategories } from '../data';
import { motion } from 'motion/react';
import { useFirebaseData } from '../FirebaseDataContext';
import { useState } from 'react';

export default function Menu() {
  const { menuItems, deals, businessDetails } = useFirebaseData();

  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-[#FFB800] uppercase mb-3">Our Menu</h2>
          <h3 className="text-4xl font-extrabold text-white">Explore Our Delicious Range</h3>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-[#FFB800] text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-stone-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold text-white leading-tight">{item.name}</h4>
                  {item.category === 'pizza' && (item.priceSmall || item.priceMedium || item.priceLarge) ? (
                    <div className="flex flex-col items-end text-sm font-bold text-[#FFB800] whitespace-nowrap ml-4 leading-tight">
                      {item.priceSmall && <span>S: {item.priceSmall}</span>}
                      {item.priceMedium && <span>M: {item.priceMedium}</span>}
                      {item.priceLarge && <span>L: {item.priceLarge}</span>}
                    </div>
                  ) : (
                    <span className="font-bold text-[#FFB800] whitespace-nowrap ml-4">{item.price}</span>
                  )}
                </div>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>
                <button className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-medium transition-colors">
                  Order Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
