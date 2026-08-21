import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { Trash2, Edit2, Plus, LogOut } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'menu' | 'deals' | 'business'>('menu');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [businessDetails, setBusinessDetails] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        if (u.email?.toLowerCase() === 'ubaidullah.bhatti99@gmail.com') {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', u.uid));
            setIsAdmin(adminDoc.exists());
          } catch (e) {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    
    const unsubMenu = onSnapshot(collection(db, 'menuItems'), (snap) => {
      setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'menuItems'));
    
    const unsubDeals = onSnapshot(collection(db, 'deals'), (snap) => {
      setDeals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'deals'));
    
    const unsubBusiness = onSnapshot(doc(db, 'settings', 'businessDetails'), (doc) => {
      if (doc.exists()) {
        setBusinessDetails({ id: doc.id, ...doc.data() });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/businessDetails'));

    return () => {
      unsubMenu();
      unsubDeals();
      unsubBusiness();
    };
  }, [user, isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loadingAuth || (user && isAdmin === null)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 p-4 text-center">
        <BrandLogo className="w-64 mb-8" />
        <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 text-center max-w-md w-full">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-stone-400 mb-8">Your account ({user.email}) does not have permission to view the admin panel.</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 p-4">
        <BrandLogo className="w-64 mb-8" />
        <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-stone-400 mb-8">Sign in with your authorized Google account to manage the website content.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-[#FFB800] hover:bg-[#e5a600] text-stone-950 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <BrandLogo className="w-full" />
        </div>
        <div className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'menu' ? 'bg-[#FFB800] text-stone-950' : 'text-stone-400 hover:bg-stone-800 hover:text-white'}`}
          >
            Menu Items
          </button>
          <button 
            onClick={() => setActiveTab('deals')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'deals' ? 'bg-[#FFB800] text-stone-950' : 'text-stone-400 hover:bg-stone-800 hover:text-white'}`}
          >
            Deals
          </button>
          <button 
            onClick={() => setActiveTab('business')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'business' ? 'bg-[#FFB800] text-stone-950' : 'text-stone-400 hover:bg-stone-800 hover:text-white'}`}
          >
            Business Settings
          </button>
        </div>
        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center overflow-hidden">
              {user.photoURL ? <img src={user.photoURL} alt="User" /> : <div className="text-sm font-bold">{user.email?.charAt(0).toUpperCase()}</div>}
            </div>
            <div className="text-sm truncate text-stone-400">{user.email}</div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {activeTab === 'menu' && <MenuManager items={menuItems} />}
        {activeTab === 'deals' && <DealsManager items={deals} />}
        {activeTab === 'business' && <BusinessManager details={businessDetails} />}
      </div>
    </div>
  );
}

// Menu Manager Component
function MenuManager({ items }: { items: any[] }) {
  const [editing, setEditing] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('pizza');

  // When editing item changes, reset category state
  useEffect(() => {
    if (editing) {
      setSelectedCategory(editing.category || 'pizza');
    }
  }, [editing]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const category = fd.get('category') as string;
    
    let data: any = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      category: category,
      image: fd.get('image') as string,
    };

    if (category === 'pizza') {
      data.priceSmall = fd.get('priceSmall') as string || '';
      data.priceMedium = fd.get('priceMedium') as string || '';
      data.priceLarge = fd.get('priceLarge') as string || '';
      // Default overall price to the medium one to not break rules entirely if someone only reads price
      data.price = fd.get('priceMedium') as string || ''; 
    } else {
      data.price = fd.get('price') as string;
    }
    
    try {
      if (editing?.id) {
        await updateDoc(doc(db, 'menuItems', editing.id), data);
      } else {
        await addDoc(collection(db, 'menuItems'), data);
      }
      setEditing(null);
    } catch (error) {
      handleFirestoreError(error, editing?.id ? OperationType.UPDATE : OperationType.CREATE, 'menuItems');
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'menuItems', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'menuItems');
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Manage Menu Items</h2>
        <button onClick={() => setEditing({})} className="bg-[#FFB800] text-stone-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-stone-900 p-6 rounded-xl border border-stone-800 mb-8 grid grid-cols-2 gap-4">
          <div className="col-span-2 text-xl font-bold mb-2">{editing.id ? 'Edit Item' : 'Add New Item'}</div>
          <div><label className="block text-sm mb-1 text-stone-400">Name</label><input required name="name" defaultValue={editing.name} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
          
          <div>
            <label className="block text-sm mb-1 text-stone-400">Category</label>
            <select required name="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded p-2">
              <option value="pizza">Pizza</option>
              <option value="burgers">Burgers</option>
              <option value="shawarma">Shawarma</option>
              <option value="spin_roll">Spin Roll</option>
              <option value="wings">Wings</option>
              <option value="fries">Fries</option>
              <option value="sides">Sides / Drinks</option>
            </select>
          </div>

          {selectedCategory === 'pizza' ? (
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <div><label className="block text-sm mb-1 text-stone-400">Small Price</label><input name="priceSmall" defaultValue={editing.priceSmall} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
              <div><label className="block text-sm mb-1 text-stone-400">Medium Price</label><input name="priceMedium" defaultValue={editing.priceMedium} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
              <div><label className="block text-sm mb-1 text-stone-400">Large Price</label><input name="priceLarge" defaultValue={editing.priceLarge} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
            </div>
          ) : (
            <div><label className="block text-sm mb-1 text-stone-400">Price</label><input required name="price" defaultValue={editing.price} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
          )}

          <div><label className="block text-sm mb-1 text-stone-400">Image URL</label><input required name="image" defaultValue={editing.image} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
          
          <div className="col-span-2"><label className="block text-sm mb-1 text-stone-400">Description</label><textarea required name="description" defaultValue={editing.description} className="w-full bg-stone-950 border border-stone-800 rounded p-2" rows={3}></textarea></div>
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-stone-800 rounded text-stone-300 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#FFB800] text-stone-950 font-bold rounded">Save Item</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-stone-800 overflow-hidden"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
              <div>
                <h3 className="font-bold text-lg">{item.name} <span className="text-sm font-normal text-stone-500 bg-stone-950 px-2 py-0.5 rounded ml-2 capitalize">{item.category.replace('_', ' ')}</span></h3>
                {item.category === 'pizza' ? (
                  <div className="text-xs text-[#FFB800] font-bold flex gap-3 mt-1">
                    {item.priceSmall && <span>S: {item.priceSmall}</span>}
                    {item.priceMedium && <span>M: {item.priceMedium}</span>}
                    {item.priceLarge && <span>L: {item.priceLarge}</span>}
                  </div>
                ) : (
                  <p className="text-[#FFB800] font-bold mt-1">{item.price}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(item)} className="p-2 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 transition-colors"><Edit2 className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-900/30 hover:bg-red-900/60 rounded text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Deals Manager Component
function DealsManager({ items }: { items: any[] }) {
  const [editing, setEditing] = useState<any>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const itemsRaw = fd.get('items') as string;
    const itemsList = itemsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    const data = {
      title: fd.get('title') as string,
      price: fd.get('price') as string,
      savings: fd.get('savings') as string,
      items: itemsList,
    };
    
    try {
      if (editing?.id) {
        await updateDoc(doc(db, 'deals', editing.id), data);
      } else {
        await addDoc(collection(db, 'deals'), data);
      }
      setEditing(null);
    } catch (error) {
      handleFirestoreError(error, editing?.id ? OperationType.UPDATE : OperationType.CREATE, 'deals');
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDoc(doc(db, 'deals', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'deals');
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Manage Deals</h2>
        <button onClick={() => setEditing({})} className="bg-[#FFB800] text-stone-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Deal
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-stone-900 p-6 rounded-xl border border-stone-800 mb-8 grid grid-cols-2 gap-4">
          <div className="col-span-2 text-xl font-bold mb-2">{editing.id ? 'Edit Deal' : 'Add New Deal'}</div>
          <div><label className="block text-sm mb-1 text-stone-400">Title</label><input required name="title" defaultValue={editing.title} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
          <div><label className="block text-sm mb-1 text-stone-400">Price</label><input required name="price" defaultValue={editing.price} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
          <div><label className="block text-sm mb-1 text-stone-400">Savings (e.g. Rs. 300)</label><input required name="savings" defaultValue={editing.savings} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
          <div className="col-span-2"><label className="block text-sm mb-1 text-stone-400">Included Items (comma separated)</label><textarea required name="items" defaultValue={(editing.items || []).join(', ')} className="w-full bg-stone-950 border border-stone-800 rounded p-2" rows={3} placeholder="1 Large Pizza, 1 Drink, ..."></textarea></div>
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-stone-800 rounded text-stone-300 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#FFB800] text-stone-950 font-bold rounded">Save Deal</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-stone-900 border border-stone-800 p-6 rounded-xl relative">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">SAVE {item.savings}</div>
            <h3 className="font-bold text-xl mb-1">{item.title}</h3>
            <p className="text-[#FFB800] font-bold text-2xl mb-4">{item.price}</p>
            <ul className="list-disc pl-5 mb-4 text-stone-300 text-sm space-y-1">
              {item.items.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
            </ul>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(item)} className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 transition-colors text-sm font-medium">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/60 rounded text-red-500 transition-colors text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Business Settings Manager
function BusinessManager({ details }: { details: any }) {
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const data = {
      name: fd.get('name') as string,
      branch: fd.get('branch') as string,
      address: fd.get('address') as string,
      phone: fd.get('phone') as string,
      hours: fd.get('hours') as string,
    };
    
    try {
      await setDoc(doc(db, 'settings', 'businessDetails'), data);
      alert('Business details updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/businessDetails');
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold mb-8">Business Settings</h2>
      <form onSubmit={handleSave} className="bg-stone-900 p-8 rounded-xl border border-stone-800 grid grid-cols-2 gap-6">
        <div><label className="block text-sm mb-1 text-stone-400">Business Name</label><input required name="name" defaultValue={details?.name} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
        <div><label className="block text-sm mb-1 text-stone-400">Branch Location</label><input required name="branch" defaultValue={details?.branch} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
        <div><label className="block text-sm mb-1 text-stone-400">Phone Number</label><input required name="phone" defaultValue={details?.phone} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
        <div><label className="block text-sm mb-1 text-stone-400">Hours of Operation</label><input required name="hours" defaultValue={details?.hours} className="w-full bg-stone-950 border border-stone-800 rounded p-2" /></div>
        <div className="col-span-2"><label className="block text-sm mb-1 text-stone-400">Full Address</label><textarea required name="address" defaultValue={details?.address} className="w-full bg-stone-950 border border-stone-800 rounded p-2" rows={2}></textarea></div>
        <div className="col-span-2 pt-4">
          <button type="submit" className="w-full py-3 bg-[#FFB800] text-stone-950 font-bold rounded-lg text-lg">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
