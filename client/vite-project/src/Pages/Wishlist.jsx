import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Wishlist() {
  const navigate = useNavigate();
  const { setCustomer } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // Fetch wishlist dynamically from backend
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('/wishlist');
      if (res.data && Array.isArray(res.data.wishlist)) {
        setWishlist(res.data.wishlist);
        if (setCustomer) {
          setCustomer((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              wishlist: res.data.wishlist.map((p) => p._id),
            };
          });
        }
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Unable to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove product from wishlist dynamically
  const handleRemoveFromWishlist = async (productId) => {
    if (removingId === productId) return;

    try {
      setRemovingId(productId);
      const res = await axiosInstance.delete(`/wishlist/${productId}`);
      if (res.data?.success) {
        setWishlist((prev) => prev.filter((p) => p._id !== productId));
        if (setCustomer) {
          setCustomer((prev) => {
            if (!prev) return prev;
            const updated = (prev.wishlist || []).filter((item) => {
              const itemId = item?._id ? item._id.toString() : item.toString();
              return itemId !== productId.toString();
            });
            return {
              ...prev,
              wishlist: updated,
            };
          });
        }
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert(err.response?.data?.message || 'Failed to remove product from wishlist');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">
              My Wishlist
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              View and manage products saved to your wishlist
            </p>
          </div>

          {!loading && !error && (
            <span className="mt-3 sm:mt-0 text-sm font-medium text-neutral-600 bg-neutral-100 px-3.5 py-1.5 rounded-full w-fit">
              {wishlist.length} {wishlist.length === 1 ? 'Product' : 'Products'} Saved
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-9 h-9 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-neutral-500">
              Loading your wishlist...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center space-y-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xl select-none">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-neutral-900">
                Unable to load wishlist.
              </h3>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={fetchWishlist}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition cursor-pointer active:scale-[0.98]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center space-y-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] max-w-lg mx-auto">
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-neutral-900">
                Your wishlist is empty ❤️
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                Start saving products you love.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition cursor-pointer active:scale-[0.98]"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Dynamic Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-neutral-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col grow justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-medium text-neutral-900 text-base line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs uppercase tracking-wider font-medium text-neutral-500">
                      {product.category}
                    </p>
                    <p className="text-lg font-semibold text-neutral-900 pt-1">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </p>
                    <p
                      className={`text-sm ${
                        product.stock > 0
                          ? 'text-neutral-600'
                          : 'text-rose-600 font-medium'
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} units left`
                        : 'Out of stock'}
                    </p>
                  </div>

                  {/* Actions: View Details and Remove from Wishlist */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition cursor-pointer active:scale-[0.98]"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      disabled={removingId === product._id}
                      className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium transition cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingId === product._id
                        ? 'Removing...'
                        : 'Remove from Wishlist'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;
