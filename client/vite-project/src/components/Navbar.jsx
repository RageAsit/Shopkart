import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { axiosInstance } from '../axiosCalls/axios';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, setCustomer } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/customers/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setCustomer(null);
      navigate('/login');
    }
  };

  const isHome = location.pathname === '/home' || location.pathname === '/';
  const isProducts = location.pathname.startsWith('/products');
  const isWishlist = location.pathname.startsWith('/wishlist');
  const isCart = location.pathname.startsWith('/cart');
  const isOrders = location.pathname.startsWith('/orders') || location.pathname.startsWith('/my-orders');
  const wishlistCount = Array.isArray(customer?.wishlist) ? customer.wishlist.length : 0;

  return (
    <header className="w-full bg-white border-b border-neutral-100/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          {/* Shopping Cart Icon */}
          <span className="text-xl select-none" role="img" aria-label="cart">
            🛒
          </span>
          <span className="font-extrabold text-lg tracking-tight text-neutral-900">
            ShopKart
          </span>
        </Link>

        {/* Right Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Home Link */}
          <Link
            to="/home"
            className={`text-sm transition-all duration-150 ${
              isHome
                ? 'bg-[#ede9fe] text-[#6366f1] font-semibold px-4 py-1.5 rounded-full'
                : 'text-neutral-600 hover:text-neutral-900 font-medium px-3 py-1.5'
            }`}
          >
            Home
          </Link>

          {/* Products Link */}
          <Link
            to="/products"
            className={`text-sm transition-all duration-150 ${
              isProducts
                ? 'bg-[#ede9fe] text-[#6366f1] font-semibold px-4 py-1.5 rounded-full'
                : 'text-neutral-600 hover:text-neutral-900 font-medium px-3 py-1.5'
            }`}
          >
            Products
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className={`flex items-center text-sm font-medium px-3 py-1.5 transition-all duration-150 cursor-pointer ${
              isWishlist
                ? 'bg-[#ede9fe] text-[#6366f1] font-semibold px-4 py-1.5 rounded-full'
                : 'text-neutral-600 hover:text-neutral-900 font-medium px-3 py-1.5'
            }`}
          >
            <span>Wishlist</span>
            <span className="ml-1 text-rose-500 font-bold text-xs bg-rose-50 px-1.5 py-0.5 rounded-full">
              {wishlistCount}
            </span>
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className={`flex items-center text-sm font-medium px-3 py-1.5 transition-all duration-150 cursor-pointer ${
              isCart
                ? 'bg-[#ede9fe] text-[#6366f1] font-semibold px-4 py-1.5 rounded-full'
                : 'text-neutral-600 hover:text-neutral-900 font-medium px-3 py-1.5'
            }`}
          >
            <span>Cart</span>
            {' '}
            <span className="ml-1 text-indigo-600 font-bold text-xs bg-indigo-50 px-1.5 py-0.5 rounded-full">
              ({cartCount})
            </span>
          </Link>

          {/* Orders Link */}
          <Link
            to="/orders"
            className={`text-sm transition-all duration-150 ${
              isOrders
                ? 'bg-[#ede9fe] text-[#6366f1] font-semibold px-4 py-1.5 rounded-full'
                : 'text-neutral-600 hover:text-neutral-900 font-medium px-3 py-1.5'
            }`}
          >
            Orders
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-rose-600 hover:text-rose-700 px-3 py-1.5 transition-colors cursor-pointer active:scale-95"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
