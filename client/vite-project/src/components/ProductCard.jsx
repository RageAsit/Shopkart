import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { axiosInstance } from '../axiosCalls/axios.js';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { customer, setCustomer } = useAuth();
  const { cartItems, addToCart } = useCart();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState('');

  const isInCart = Boolean(
    cartItems?.some((item) => {
      const id = item.product?._id ? item.product._id : (item.product || item._id);
      return id?.toString() === product._id?.toString();
    })
  );

  const isInitiallyWishlisted = Boolean(
    customer?.wishlist?.some((item) => {
      const id = item?._id ? item._id : item;
      return id?.toString() === product._id?.toString();
    })
  );

  const [status, setStatus] = useState(isInitiallyWishlisted ? 'success' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (customer?.wishlist) {
      const isWishlisted = customer.wishlist.some((item) => {
        const id = item?._id ? item._id : item;
        return id?.toString() === product._id?.toString();
      });
      if (isWishlisted) {
        setStatus('success');
      }
    }
  }, [customer, product._id]);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent duplicate clicks while saving or if already added
    if (status === 'loading' || status === 'success') {
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await axiosInstance.post(`/wishlist/${product._id}`);
      if (res.data?.success) {
        setStatus('success');
        if (setCustomer) {
          setCustomer((prev) => {
            if (!prev) return prev;
            const currentWishlist = prev.wishlist || [];
            return {
              ...prev,
              wishlist: [...currentWishlist, product._id],
            };
          });
        }
      } else {
        setStatus('idle');
        setErrorMessage(res.data?.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setStatus('idle');
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Please log in to add to wishlist'
          : err.response?.status === 409
          ? 'Product already in wishlist'
          : 'Failed to add to wishlist');
      setErrorMessage(msg);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingToCart || product.stock <= 0) {
      return;
    }

    setIsAddingToCart(true);
    setCartError('');

    try {
      const res = await addToCart(product._id);
      if (!res?.success) {
        setCartError(res?.error || 'Failed to add to cart');
      }
    } catch (err) {
      setCartError('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
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
          {/* Product Name */}
          <h3 className="font-medium text-neutral-900 text-base line-clamp-1">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-xs uppercase tracking-wider font-medium text-neutral-500">
            {product.category}
          </p>

          {/* Price */}
          <p className="text-lg font-semibold text-neutral-900 pt-1">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </p>

          {/* Stock status */}
          <p
            className={`text-sm ${
              product.stock > 0
                ? 'text-neutral-600'
                : 'text-rose-600 font-medium'
            }`}
          >
            {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock <= 0}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
              product.stock <= 0
                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-neutral-100 text-neutral-500 border border-neutral-200 cursor-not-allowed'
                : isInCart
                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer active:scale-[0.98]'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-[0.98]'
            }`}
          >
            {isAddingToCart
              ? 'Adding...'
              : isInCart
              ? 'Add Another'
              : 'Add to Cart'}
          </button>

          {/* Cart Error Message */}
          {cartError && (
            <p className="text-xs text-rose-600 font-medium text-center">
              {cartError}
            </p>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleAddToWishlist}
            disabled={status === 'loading' || status === 'success'}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1.5 ${
              status === 'success'
                ? 'bg-rose-50 text-rose-600 border border-rose-200 cursor-default'
                : status === 'loading'
                ? 'bg-neutral-100 text-neutral-500 border border-neutral-200 cursor-not-allowed'
                : 'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 cursor-pointer active:scale-[0.98]'
            }`}
          >
            {status === 'loading' && '⏳ Saving...'}
            {status === 'success' && '♥ Added to Wishlist'}
            {status === 'idle' && '♡ Add to Wishlist'}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-xs text-rose-600 font-medium text-center">
              {errorMessage}
            </p>
          )}

          {/* View Details Button */}
          <button
            type="button"
            onClick={handleViewDetails}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition cursor-pointer active:scale-[0.98]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
