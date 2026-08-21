export const businessDetails = {
  name: "Fifth Avenue Pizza Co",
  branch: "Depalpur",
  address: "Prism Mall, Sarfaraz Gillani Road, Depalpur, 56180",
  phone: "0304 1116613",
  hours: "Open Daily • 11:00 AM - 3:00 AM",
  services: ["Dine-in", "Takeaway", "Delivery"],
};

export const menuCategories = [
  { id: "pizza", name: "Pizza" },
  { id: "burgers", name: "Burgers" },
  { id: "shawarma", name: "Shawarma" },
  { id: "spin_roll", name: "Spin Roll" },
  { id: "wings", name: "Wings" },
  { id: "fries", name: "Fries" },
  { id: "sides", name: "Sides & Drinks" },
];

export const menuItems = [
  {
    id: "bonfire-pizza",
    name: "Bonfire Pizza",
    description: "Our special spicy and smoky Bonfire sauce, premium chicken, jalapeños, and extra cheese.",
    price: "Rs. 1,600",
    priceSmall: "Rs. 700",
    priceMedium: "Rs. 1,200",
    priceLarge: "Rs. 1,600",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    description: "Traditional local flavors with marinated chicken tikka chunks, onions, and green chilies.",
    price: "Rs. 1,200",
    priceSmall: "Rs. 600",
    priceMedium: "Rs. 950",
    priceLarge: "Rs. 1,200",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "bbq-pizza",
    name: "BBQ Pizza",
    description: "BBQ chicken chunks, onions, signature BBQ sauce, and a generous layer of mozzarella.",
    price: "Rs. 1,600",
    priceSmall: "Rs. 700",
    priceMedium: "Rs. 1,200",
    priceLarge: "Rs. 1,600",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "fajita-sicilian",
    name: "Fajita Sicilian",
    description: "Spicy chicken fajita, jalapeños, onions, capsicum, and premium mozzarella.",
    price: "Rs. 1,299",
    priceSmall: "Rs. 650",
    priceMedium: "Rs. 1,000",
    priceLarge: "Rs. 1,299",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "margherita",
    name: "Classic Cheese",
    description: "A classic Italian delight with our signature tomato sauce and fresh mozzarella.",
    price: "Rs. 999",
    priceSmall: "Rs. 500",
    priceMedium: "Rs. 800",
    priceLarge: "Rs. 999",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "stuff-roll",
    name: "Stuff Roll",
    description: "Freshly baked dough stuffed with premium chicken, cheese, and special sauce.",
    price: "Rs. 699",
    category: "spin_roll",
    image: "https://images.unsplash.com/photo-1627581566860-25c7eaf2230f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "hot-wings",
    name: "Hot Wings",
    description: "Spicy and tender chicken wings, perfectly baked.",
    price: "Rs. 599",
    category: "wings",
    image: "https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "chicken-wrap",
    name: "Chicken Wrap",
    description: "Grilled chicken, fresh veggies, and our signature sauce wrapped in a soft tortilla.",
    price: "Rs. 450",
    category: "shawarma",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=600",
  }
];

export const deals = [
  {
    id: "midnight-deal",
    title: "Midnight Craving",
    price: "Rs. 1,699",
    savings: "Rs. 300",
    items: [
      "1 Large Signature Pizza",
      "1 Ltr Cold Drink",
      "Free Extra Dip"
    ]
  },
  {
    id: "family-fiesta",
    title: "Family Fiesta",
    price: "Rs. 2,999",
    savings: "Rs. 500",
    items: [
      "2 Large Classic Pizzas",
      "1 Oven Baked Hot Wings",
      "1.5 Ltr Cold Drink"
    ]
  },
  {
    id: "student-deal",
    title: "Student Deal",
    price: "Rs. 650",
    savings: "Rs. 150",
    items: [
      "1 Small Classic Pizza",
      "1 Regular Drink"
    ]
  }
];
