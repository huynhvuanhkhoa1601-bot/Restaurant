import React from 'react';
import Header from './components/Header';
import LiveOrderTicker from './components/LiveOrderTicker';
import Hero from './components/Hero';
import HotDealsShowcase from './components/HotDealsShowcase';
import Promotions from './components/Promotions';
import Categories from './components/Categories';
import FoodList from './components/FoodList';
import StorySection from './components/StorySection';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import FoodDetailModal from './components/FoodDetailModal';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import TableReservationModal from './components/TableReservationModal';
import AuthModal from './components/AuthModal';
import QuickChatWidget from './components/QuickChatWidget';
import Toast from './components/Toast';

function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F19] text-gray-800 dark:text-gray-100 flex flex-col selection:bg-orange-500 selection:text-white transition-colors duration-300">
      
      {/* 1. Header (Navbar, Search, Cart Icon, Dark Mode) */}
      <Header />

      {/* Real-time Bustling Order Activity Marquee Ticker */}
      <LiveOrderTicker />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 2. Hero Section (Banner, Slogan, CTA, Signature Carousel) */}
        <Hero />

        {/* 3. Hot Deals & Animated Video/GIF Combo Advertisements */}
        <HotDealsShowcase />

        {/* 4. Promotions & Vouchers Slider */}
        <Promotions />

        {/* 5. Categories Filter Pills */}
        <Categories />

        {/* 6. Food List / Menu Grid with Smart Filters */}
        <FoodList />

        {/* 7. Brand Story & Michelin Standard Highlights */}
        <StorySection />

        {/* 8. Customer Reviews & Testimonials */}
        <Reviews />

      </main>

      {/* 8. Footer (Contact, Locations, Newsletter, Social Links) */}
      <Footer />

      {/* Modals, Drawers & Overlays */}
      <CartModal />
      <FoodDetailModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <TableReservationModal />
      <AuthModal />
      <QuickChatWidget />
      <Toast />

    </div>
  );
}

export default App;
