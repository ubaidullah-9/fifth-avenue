/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Deals from './components/Deals';
import Menu from './components/Menu';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppButton from './components/WhatsAppButton';
import { useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';
import { FirebaseDataProvider } from './FirebaseDataContext';

function MainSite() {
  return (
    <FirebaseDataProvider>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Deals />
        <Menu />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </FirebaseDataProvider>
  );
}

export default function App() {
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-stone-950 font-sans selection:bg-[#FFB800]/30 text-white">
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
