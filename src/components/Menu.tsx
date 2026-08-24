import { menuCategories } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebaseData } from '../FirebaseDataContext';
import { useState } from 'react';
import { useCart, parsePrice } from '../CartContext';
import { Plus, Check } from 'lucide-react';

function MenuItemCard({ item }: { item: any }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large'>(
    item.priceSmall ? 'Small' : (item.priceMedium ? 'Medium' : 'Large')
  );
  const [added, setAdded] = useState(false);

  const hasSizes = item.category === 'pizza' && (item.priceSmall || item.priceMedium || item.priceLarge);

  const handleAdd = () => {
    const priceStr = hasSizes ? item[`price${selectedSize}`] : item.price;
    addToCart({
      id: hasSizes ? `${item.id}-${selectedSize.toLowerCase()}` : item.id,
      name: item.name,
      size: hasSizes ? selectedSize : undefined,
      price: parsePrice(priceStr),
      quantity: 1,
      image: item.image,
      type: 'menu'
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
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
          {hasSizes ? (
            <div className="flex flex-col items-end text-sm font-bold text-[#FFB800] whitespace-nowrap ml-4 leading-tight">
              {item.priceSmall && <span className={selectedSize === 'Small' ? '' : 'opacity-50'}>S: {item.priceSmall}</span>}
              {item.priceMedium && <span className={selectedSize === 'Medium' ? '' : 'opacity-50'}>M: {item.priceMedium}</span>}
              {item.priceLarge && <span className={selectedSize === 'Large' ? '' : 'opacity-50'}>L: {item.priceLarge}</span>}
            </div>
          ) : (
            <span className="font-bold text-[#FFB800] whitespace-nowrap ml-4">{item.price}</span>
          )}
        </div>
        <p className="text-stone-400 text-sm leading-relaxed mb-6 flex-grow">
          {item.description}
        </p>

        {hasSizes && (
          <div className="flex gap-2 mb-4 bg-stone-900 p-1 rounded-lg">
            {['Small', 'Medium', 'Large'].map((size) => {
              if (!item[`price${size}`]) return null;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size as any)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${selectedSize === size ? 'bg-[#FFB800] text-stone-950' : 'text-stone-400 hover:text-white'}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}

        <button 
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${added ? 'bg-green-500 text-white' : 'bg-stone-800 hover:bg-stone-700 text-white'}`}
        >
          {added ? <><Check className="w-4 h-4" /> Added</> : <><Plus className="w-4 h-4" /> Add to Order</>}
        </button>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const { menuItems, deals, businessDetails } = useFirebaseData();

  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-16 md:py-24 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-[#FFB800] uppercase mb-3">Our Menu</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white">Explore Our Delicious Range</h3>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide py-2 md:flex-wrap justify-start md:justify-center gap-3 sm:gap-4 mb-12 md:mb-16 -mx-4 px-4 sm:mx-0 sm:px-0">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
