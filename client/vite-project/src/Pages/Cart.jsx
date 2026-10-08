import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    refreshCart,
    cartCount,
    cartTotal,
    subtotal,
    totalUnits,
    cartItemCount,
  } = useCart();

  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Handle quantity decrement
  const handleDecrement = async (item) => {
    const product = item.product;
    const productId = product?._id || product || item._id;

    if (item.quantity <= 1) return;
    if (updatingId === productId || removingId === productId) return;

    setUpdatingId(productId);
    setActionError('');
    try {
      const res = await updateQuantity(productId, item.quantity - 1);
      if (!res?.success) {
        setActionError(res?.error || 'Failed to update quantity');
      }
    } catch (err) {
      setActionError('Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle quantity increment
  const handleIncrement = async (item) => {
    const product = item.product;
    const productId = product?._id || product || item._id;
    const stock = typeof product?.stock === 'number' ? product.stock : 999;

    if (item.quantity >= stock) {
      setActionError(`Only ${stock} units available in stock`);
      return;
    }
    if (updatingId === productId || removingId === productId) return;

    setUpdatingId(productId);
    setActionError('');
    try {
      const res = await updateQuantity(productId, item.quantity + 1);
      if (!res?.success) {
        setActionError(res?.error || 'Failed to update quantity');
      }
    } catch (err) {
      setActionError('Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle remove item
  const handleRemove = async (item) => {
    const product = item.product;
    const productId = product?._id || product || item._id;

    if (removingId === productId || updatingId === productId) return;

    setRemovingId(productId);
    setActionError('');
    try {
      const res = await removeFromCart(productId);
      if (!res?.success) {
        setActionError(res?.error || 'Failed to remove product');
      }
    } catch (err) {
      setActionError('Failed to remove product');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grow">
        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              My Cart
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {cartCount > 0
                ? `You have ${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your shopping cart`
                : 'Your shopping cart is currently empty'}
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Global Action Error Banner */}
        {(actionError || error) && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{actionError || error}</span>
            <button
              onClick={() => {
                setActionError('');
                refreshCart();
              }}
              className="text-xs font-semibold underline ml-4 cursor-pointer hover:text-rose-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && cartItems.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center space-y-4 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-9 h-9 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-neutral-500 text-sm font-medium">Loading your cart...</p>
          </div>
        ) : !loading && error && cartItems.length === 0 ? (
          /* Error State */
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center space-y-4 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xl select-none">
              ⚠️
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-medium text-neutral-900">
                Unable to load your cart.
              </h2>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={refreshCart}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition cursor-pointer active:scale-95 shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center space-y-4 shadow-sm max-w-lg mx-auto my-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-neutral-900">
                Your cart is empty 🛒
              </h2>
              <p className="text-neutral-500 text-sm">
                Looks like you haven't added anything yet.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition cursor-pointer active:scale-95 shadow-sm"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl shadow-sm divide-y divide-neutral-100 overflow-hidden">
              {cartItems.map((item) => {
                const product = item.product || {};
                const productId = product._id || product || item._id;
                const isUpdating = updatingId === productId;
                const isRemoving = removingId === productId;
                const price = Number(product.price) || 0;
                const lineTotal = price * (item.quantity || 1);
                const stock = typeof product.stock === 'number' ? product.stock : 999;

                return (
                  <div
                    key={item._id || productId}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 transition hover:bg-neutral-50/50"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-28 h-28 shrink-0 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200/60 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/200x200?text=Product';
                        }}
                      />
                    </div>

                    {/* Product Info & Controls */}
                    <div className="flex flex-col justify-between grow space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/products/${product._id}`}
                            className="font-semibold text-neutral-900 text-base hover:text-indigo-600 transition line-clamp-1"
                          >
                            {product.name || 'Unnamed Product'}
                          </Link>
                          {product.category && (
                            <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-0.5">
                              {product.category}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-neutral-700 mt-1">
                            ₹{price.toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* Line Total */}
                        <div className="sm:text-right">
                          <p className="text-lg font-bold text-neutral-900">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-neutral-400 font-medium">
                            ₹{price.toLocaleString('en-IN')} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50/50 overflow-hidden shadow-xs">
                            {/* Decrement Button */}
                            <button
                              type="button"
                              onClick={() => handleDecrement(item)}
                              disabled={item.quantity <= 1 || isUpdating || isRemoving}
                              aria-label="Decrease quantity"
                              className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition ${
                                item.quantity <= 1 || isUpdating || isRemoving
                                  ? 'text-neutral-300 cursor-not-allowed'
                                  : 'text-neutral-700 hover:bg-neutral-200/60 cursor-pointer active:scale-95'
                              }`}
                            >
                              -
                            </button>

                            {/* Quantity Display */}
                            <span
                              className={`w-10 text-center text-sm font-semibold text-neutral-900 select-none ${
                                isUpdating ? 'opacity-60' : ''
                              }`}
                            >
                              {item.quantity}
                            </span>

                            {/* Increment Button */}
                            <button
                              type="button"
                              onClick={() => handleIncrement(item)}
                              disabled={item.quantity >= stock || isUpdating || isRemoving}
                              aria-label="Increase quantity"
                              className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition ${
                                item.quantity >= stock || isUpdating || isRemoving
                                  ? 'text-neutral-300 cursor-not-allowed'
                                  : 'text-neutral-700 hover:bg-neutral-200/60 cursor-pointer active:scale-95'
                              }`}
                            >
                              +
                            </button>
                          </div>

                          {stock <= 5 && stock > 0 && (
                            <span className="text-xs text-amber-600 font-medium ml-1">
                              Only {stock} left
                            </span>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          disabled={isRemoving || isUpdating}
                          className={`text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer ${
                            isRemoving ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                          }`}
                        >
                          {isRemoving ? 'Removing…' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight border-b border-neutral-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Items</span>
                  <span className="font-semibold text-neutral-900">{cartCount}</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>

                <div className="border-t border-neutral-100 pt-3 flex justify-between text-base font-bold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="text-indigo-600 text-lg">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition cursor-pointer active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>

              <div className="text-center">
                <p className="text-xs text-neutral-400">
                  🔒 Secure Checkout · 100% Money-back guarantee
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
