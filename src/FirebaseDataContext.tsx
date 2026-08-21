import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';

interface DataContextType {
  menuItems: any[];
  deals: any[];
  businessDetails: any;
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  menuItems: [],
  deals: [],
  businessDetails: null,
  loading: true,
});

export const useFirebaseData = () => useContext(DataContext);

// Default fallbacks to show something while loading or if empty
import { menuItems as defaultMenuItems, deals as defaultDeals, businessDetails as defaultBusinessDetails } from './data';

export const FirebaseDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<any[]>(defaultMenuItems);
  const [deals, setDeals] = useState<any[]>(defaultDeals);
  const [businessDetails, setBusinessDetails] = useState<any>(defaultBusinessDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let menuLoaded = false;
    let dealsLoaded = false;
    let businessLoaded = false;

    const checkLoading = () => {
      if (menuLoaded && dealsLoaded && businessLoaded) {
        setLoading(false);
      }
    };

    const unsubMenu = onSnapshot(collection(db, 'menuItems'), (snap) => {
      if (!snap.empty) {
        setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      menuLoaded = true;
      checkLoading();
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'menuItems'));
    
    const unsubDeals = onSnapshot(collection(db, 'deals'), (snap) => {
      if (!snap.empty) {
        setDeals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      dealsLoaded = true;
      checkLoading();
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'deals'));
    
    const unsubBusiness = onSnapshot(doc(db, 'settings', 'businessDetails'), (docSnap) => {
      if (docSnap.exists()) {
        setBusinessDetails({ id: docSnap.id, ...docSnap.data() });
      }
      businessLoaded = true;
      checkLoading();
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/businessDetails'));

    return () => {
      unsubMenu();
      unsubDeals();
      unsubBusiness();
    };
  }, []);

  return (
    <DataContext.Provider value={{ menuItems, deals, businessDetails, loading }}>
      {children}
    </DataContext.Provider>
  );
};
