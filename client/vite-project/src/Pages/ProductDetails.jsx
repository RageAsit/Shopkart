import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState('');

  const isInCart = Boolean(
    cartItems?.some((item) => {
      const pId = item.product?._id ? item.product._id : (item.product || item._id);
      return pId?.toString() === product?._id?.toString();
    })
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(`/products/${id}`);

        if (res.data) {
          setProduct(res.data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (err.response && err.response.status === 404) {
          // If product not found in DB
          setProduct(null);
        } else {
          setError('Something went wrong while loading products.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0 || isAddingToCart) return;

    setIsAddingToCart(true);
    setCartError('');
    try {
      const res = await addToCart(product._id);
      if (res?.success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      } else {
        setCartError(res?.error || 'Failed to add to cart');
      }
    } catch (err) {
      setCartError('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </button>
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <div className="w-9 h-9 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-neutral-600">
              Loading products...
            </p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl text-center text-sm font-medium">
            Something went wrong while loading products.
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && !product && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center space-y-3">
            <h3 className="text-xl font-medium text-neutral-900">
              No products found.
            </h3>
            <p className="text-sm text-neutral-500">
              The product you are looking for may have been removed or does not exist.
            </p>
            <Link
              to="/products"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* 4. Product Details Display */}
        {!loading && !error && product && (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Large Product Image */}
            <div className="w-full aspect-square bg-neutral-100 rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x600?text=No+Image';
                }}
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                {/* Category */}
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <p className="text-3xl font-bold text-neutral-900 pt-2">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Stock Status */}
              <div className="pt-2 border-t border-neutral-100">
                <span className="text-sm font-medium text-neutral-500">
                  Availability:{' '}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} units left in stock`
                    : 'Out of stock'}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <h2 className="text-xs uppercase font-semibold text-neutral-400 tracking-wider">
                  Description
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingToCart}
                  className={`w-full py-3.5 px-6 rounded-2xl font-medium text-sm transition cursor-pointer active:scale-[0.99] flex items-center justify-center space-x-2 ${
                    product.stock <= 0
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : isAddingToCart
                      ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      : addedToCart
                      ? 'bg-emerald-600 text-white'
                      : isInCart
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>
                    {product.stock <= 0
                      ? 'Out of Stock'
                      : isAddingToCart
                      ? 'Adding...'
                      : addedToCart
                      ? 'Added to Cart ✓'
                      : isInCart
                      ? 'Add Another'
                      : 'Add to Cart'}
                  </span>
                </button>
                {cartError && (
                  <p className="text-center text-xs text-rose-600 font-medium mt-2">
                    {cartError}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
