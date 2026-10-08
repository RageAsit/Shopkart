import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { axiosInstance } from '../axiosCalls/axios';

function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    // If order is not available from router state, fetch from backend GET /orders/:id
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          setError('');
          const res = await axiosInstance.get(`/orders/${id}`);
          if (res.data?.success && res.data.order) {
            setOrder(res.data.order);
          } else {
            setError(res.data?.message || 'Order details not found.');
          }
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError(
            err.response?.data?.message ||
              'Unable to load order details. Please check your order history.'
          );
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id, order]);

  const orderId = order?._id || id || 'N/A';
  const totalAmount = Number(order?.totalAmount) || 0;
  const status = (order?.status || 'PLACED').toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900 flex flex-col">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grow flex flex-col justify-center">
        {loading ? (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center shadow-sm space-y-4">
            <div className="w-10 h-10 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-neutral-500">Loading order confirmation...</p>
          </div>
        ) : error && !order ? (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-10 text-center shadow-sm space-y-5">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-xl mx-auto select-none">
              ⚠️
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-neutral-900">Order Information</h2>
              <p className="text-sm text-neutral-600">{error}</p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/products"
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Suggested UI Card */
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
            {/* Header: ✅ Order Placed Successfully */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 text-2xl mb-2 select-none shadow-xs">
                ✅
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Order Placed Successfully
              </h1>
              <p className="text-sm text-neutral-500">
                Your order has been saved successfully.
              </p>
            </div>

            {/* Key Order Attributes */}
            <div className="bg-neutral-50/70 border border-neutral-200/70 rounded-2xl p-6 divide-y divide-neutral-200/60 space-y-3.5">
              {/* Order ID */}
              <div className="flex items-center justify-between text-sm pt-1 first:pt-0">
                <span className="text-neutral-500 font-medium">Order ID:</span>
                <span className="font-mono font-bold text-neutral-900 text-sm sm:text-base break-all">
                  {orderId}
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between text-sm pt-3.5">
                <span className="text-neutral-500 font-medium">Total:</span>
                <span className="font-bold text-neutral-900 text-lg sm:text-xl">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-sm pt-3.5">
                <span className="text-neutral-500 font-medium">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800">
                  {status}
                </span>
              </div>
            </div>

            {/* Purchased Items Snapshot Summary (if available) */}
            {order?.items && order.items.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Ordered Items ({order.items.length})
                </h3>
                <div className="border border-neutral-100 rounded-xl divide-y divide-neutral-100 overflow-hidden bg-white">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-neutral-200/60 shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-neutral-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: [ View My Orders ] & [ Continue Shopping ] */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition cursor-pointer active:scale-95 text-center shadow-sm"
              >
                View My Orders
              </button>

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100/70 text-neutral-800 font-semibold text-sm transition cursor-pointer active:scale-95 text-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderSuccess;
