import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Navbar from '../components/Navbar.jsx';

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Category Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  // Synchronize category with URL search param if URL changes
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat !== null) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Books',
    'Home',
  ];

  // Fetch products with optional search and category query params
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically build query parameters
        const params = {};
        if (search.trim()) {
          params.search = search.trim();
        }
        if (category && category !== 'All Categories') {
          params.category = category;
        }

        const res = await axiosInstance.get('/products', { params });

        if (res.data && res.data.products) {
          setProducts(res.data.products);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly (300ms) to prevent unnecessary API calls while typing
    const debounceTimer = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">
              Products
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Explore our collection of quality products
            </p>
          </div>
          {!loading && !error && (
            <span className="mt-3 sm:mt-0 text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full w-fit">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
            </span>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat === 'All Categories' ? '' : cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-neutral-500">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-center text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center space-y-2">
            <h3 className="text-lg font-medium text-neutral-800">
              No products found.
            </h3>
            <p className="text-sm text-neutral-500">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}

        {/* Dynamic Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
