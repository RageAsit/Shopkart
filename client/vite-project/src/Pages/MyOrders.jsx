import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { axiosInstance } from '../axiosCalls/axios';

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('/orders');
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(
        err.response?.data?.message || 'Failed to load your orders. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recent';
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900 flex flex-col">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grow space-y-6">
        {/* Page Title */}
        <div className="pb-2 border-b border-neutral-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            My Orders
          </h1>
        </div>

        {/* 1. Loading state */}
        {loading ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center space-y-4 shadow-xs">
            <div className="w-9 h-9 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-neutral-500">Loading your orders...</p>
          </div>
        ) : error ? (
          /* 2. Error state */
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-10 text-center space-y-4 shadow-xs max-w-md mx-auto">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-xl mx-auto select-none">
              ⚠️
            </div>
            <p className="text-sm font-medium text-neutral-800">{error}</p>
            <button
              type="button"
              onClick={fetchOrders}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* 3. Empty state */
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 sm:p-14 text-center space-y-5 shadow-xs max-w-md mx-auto">
            <p className="text-neutral-700 text-base font-normal">
              You have not placed any orders yet.
            </p>
            <div>
              <Link
                to="/products"
                className="inline-block px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold transition active:scale-95 shadow-xs"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* 4. Suggested UI Order Cards */
          <div className="space-y-4">
            {orders.map((ord) => {
              const status = (ord.status || 'PLACED').toUpperCase();

              return (
                <div
                  key={ord._id}
                  className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs hover:border-neutral-300 transition space-y-4 text-left"
                >
                  {/* Order # and Date */}
                  <div className="space-y-1">
                    <h2 className="font-semibold text-neutral-900 text-base">
                      Order #{ord._id}
                    </h2>
                    <p className="text-sm text-neutral-600">
                      {formatDate(ord.createdAt)}
                    </p>
                  </div>

                  {/* Items List (Keyboard × 2) */}
                  {ord.items && ord.items.length > 0 && (
                    <div className="space-y-1 py-1">
                      {ord.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-neutral-800 font-medium">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Total and Status */}
                  <div className="space-y-1 text-sm pt-1">
                    <p className="font-medium text-neutral-900">
                      Total: ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                    </p>
                    <p className="font-medium text-neutral-900">
                      Status: <span className="font-semibold text-emerald-700">{status}</span>
                    </p>
                  </div>

                  {/* View Details Action */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/orders/${ord._id}`, { state: { order: ord } })
                      }
                      className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer active:scale-95 shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;
