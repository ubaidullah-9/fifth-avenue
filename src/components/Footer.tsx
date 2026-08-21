import { useFirebaseData } from '../FirebaseDataContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { menuItems, deals, businessDetails } = useFirebaseData();

  return (
    <footer className="bg-stone-950 py-12 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-6">
          <BrandLogo className="w-48 sm:w-56" />
        </div>
        <p className="text-stone-500 text-sm mb-6 max-w-md">
          Serving the finest, freshly baked pizzas in Depalpur. Perfect for dine-in, takeaway, or late-night delivery.
        </p>
        <div className="text-stone-600 text-xs">
          &copy; {new Date().getFullYear()} {businessDetails.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
