import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Home() {
  const navigate = useNavigate();
  const { customer } = useAuth();

  // Categories matching the screenshot
  const categories = [
    {
      name: 'Electronics',
      subtitle: 'Gadgets, accessories & gear',
      icon: '⚡',
      iconBg: 'text-amber-500',
    },
    {
      name: 'Fashion',
      subtitle: 'Apparel, footwear & styles',
      icon: '👕',
      iconBg: 'text-blue-500',
    },
    {
      name: 'Books',
      subtitle: 'Guides, literature & reads',
      icon: '📚',
      iconBg: 'text-emerald-500',
    },
    {
      name: 'Home',
      subtitle: 'Living, décor & appliances',
      icon: '🏡',
      iconBg: 'text-teal-500',
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  // Customer fallback to match the lab/screenshot if not yet set
  const customerName = customer?.fullName || 'Manan Ashwin Raythatha';
  const customerEmail = customer?.email || 'mananar2007@gmail.com';
  const customerPhone = customer?.phone || '9008546318';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 font-sans antialiased">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* 1. Hero Banner */}
        <section
          className="relative overflow-hidden rounded-[28px] p-8 sm:p-12 lg:p-14 text-white shadow-xl shadow-blue-500/10"
          style={{
            background:
              'linear-gradient(115deg, #3d4fe0 0%, #4654ea 35%, #2563eb 60%, #06b6d4 95%)',
          }}
        >
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            {/* Tag pill */}
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-white bg-white/20 backdrop-blur-md uppercase mb-4">
              ShopKart Catalog
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight mb-3">
              Welcome to ShopKart
            </h1>

            {/* Description */}
            <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed mb-7 max-w-xl">
              Explore our latest products and find what you're looking for. High quality items at great prices.
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-50 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer active:scale-95"
            >
              <span>Browse Products</span>
              <span className="text-sm font-bold">→</span>
            </button>
          </div>
        </section>

        {/* 2. Browse by Category */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                Browse by Category
              </h2>
              <p className="text-sm text-neutral-500 mt-0.5">
                Select a category to quickly filter products
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca] inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all</span>
              <span className="text-sm">→</span>
            </button>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Category Icon */}
                  <div className="text-2xl sm:text-3xl mb-3 select-none transition-transform duration-200 group-hover:scale-110 origin-left">
                    {cat.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-neutral-900 group-hover:text-[#4f46e5] transition-colors">
                    {cat.name}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Account Overview */}
        <section className="space-y-4 pt-4 border-t border-neutral-200/60">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-[#4f46e5] uppercase">
              Account Overview
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mt-0.5">
              Customer Profile: {customerName}
            </h2>
          </div>

          {/* Account Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Customer Name */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Customer Name
              </span>
              <p className="text-base sm:text-lg font-bold text-neutral-900">
                {customerName}
              </p>
            </div>

            {/* Email Address */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Email Address
              </span>
              <p className="text-base sm:text-lg font-bold text-neutral-900 break-all">
                {customerEmail}
              </p>
            </div>

            {/* Phone Number */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/70 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Phone Number
              </span>
              <p className="text-base sm:text-lg font-bold text-neutral-900">
                {customerPhone}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;