import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../axiosCalls/axios';

function Checkout() {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const {
    cartItems,
    cartTotal,
    loading: cartLoading,
    refreshCart,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Autofill full name and phone from customer profile if available
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || customer.fullName || '',
        phone: prev.phone || customer.phone || '',
      }));
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-level error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (formError) {
      setFormError('');
    }
  };

  // Client-side validation function according to Task 3 rules
  const validateForm = () => {
    const errors = {};

    // 1. Full Name: required, non-whitespace
    if (!formData.fullName || formData.fullName.trim() === '') {
      errors.fullName = 'Full Name is required.';
    }

    // 2. Phone Number: required, non-whitespace, valid number format
    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = 'Phone Number is required.';
    } else {
      const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
      const phoneRegex = /^(\+?\d{1,3})?\d{10}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = 'Phone should contain a valid number format.';
      }
    }

    // 3. Address Line: required, non-whitespace
    if (!formData.address || formData.address.trim() === '') {
      errors.address = 'Address Line is required.';
    }

    // 4. City: required, non-whitespace
    if (!formData.city || formData.city.trim() === '') {
      errors.city = 'City is required.';
    }

    // 5. State: required, non-whitespace
    if (!formData.state || formData.state.trim() === '') {
      errors.state = 'State is required.';
    }

    // 6. Pincode: required, non-whitespace, must contain 6 digits
    if (!formData.pincode || formData.pincode.trim() === '') {
      errors.pincode = 'Pincode is required.';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'Pincode must contain 6 digits.';
    }

    return errors;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    // Step 1: Run client validation
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Display first error message at form-level banner as well
      const firstError = Object.values(errors)[0];
      setFormError(firstError);
      // CRITICAL: Do not call the backend if basic client validation fails!
      return;
    }

    // Step 2: Ensure cart is not empty
    if (!cartItems || cartItems.length === 0) {
      setFormError('Your cart is empty. Please add products to your cart before placing an order.');
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // Task 4: The frontend should send ONLY the shipping address.
      // Do not trust cart prices or totalAmount sent by frontend; backend computes everything from DB.
      const orderPayload = {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      };

      const response = await axiosInstance.post('/orders/create-payment-order', orderPayload);
      const checkoutData = response.data;

      if (!checkoutData?.success) {
        setFormError(checkoutData?.message || 'Failed to initialize order.');
        setIsSubmitting(false);
        return;
      }

      const isMock =
        Boolean(checkoutData.isMockPayment) ||
        !checkoutData.keyId ||
        checkoutData.keyId === 'rzp_test_placeholder' ||
        checkoutData.keyId.includes('placeholder');

      // If real Razorpay keys are configured and checkout SDK is loaded, open Razorpay Modal
      if (!isMock && typeof window !== 'undefined' && window.Razorpay && checkoutData.razorpayOrderId) {
        const options = {
          key: checkoutData.keyId,
          amount: checkoutData.amount,
          currency: checkoutData.currency || 'INR',
          name: 'ShopKart',
          description: `Order #${checkoutData.orderId}`,
          order_id: checkoutData.razorpayOrderId,
          prefill: {
            name: formData.fullName,
            contact: formData.phone,
            email: customer?.email || '',
          },
          theme: {
            color: '#171717',
          },
          handler: async function (paymentResponse) {
            try {
              setIsSubmitting(true);
              const verifyRes = await axiosInstance.post('/orders/verify-payment', {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderId: checkoutData.orderId,
              });

              if (verifyRes.data?.success) {
                // Task 5: Backend cart cleared -> Frontend cart state cleared -> Navbar becomes Cart (0)
                if (typeof clearCart === 'function') {
                  clearCart();
                }
                if (typeof refreshCart === 'function') {
                  await refreshCart();
                }
                const confirmedOrder = verifyRes.data.order;
                const confirmedOrderId = confirmedOrder?._id || checkoutData.orderId;
                // Task 6: Navigate to order success screen /order-success/:id
                navigate(`/order-success/${confirmedOrderId}`, {
                  state: { order: confirmedOrder },
                });
              } else {
                setFormError(verifyRes.data?.message || 'Payment verification failed');
              }
            } catch (vErr) {
              setFormError(vErr.response?.data?.message || 'Payment verification failed');
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failRes) {
          setFormError(failRes.error?.description || 'Payment failed');
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        // Fallback / simulated payment verification for development environments without active Razorpay keys
        try {
          const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 16);
          const verifyRes = await axiosInstance.post('/orders/verify-payment', {
            razorpay_order_id: checkoutData.razorpayOrderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'mock_valid_signature',
            orderId: checkoutData.orderId,
          });

          if (verifyRes.data?.success) {
            if (typeof clearCart === 'function') {
              clearCart();
            }
            if (typeof refreshCart === 'function') {
              await refreshCart();
            }
            const confirmedOrder = verifyRes.data.order;
            const confirmedOrderId = confirmedOrder?._id || checkoutData.orderId;
            navigate(`/order-success/${confirmedOrderId}`, {
              state: { order: confirmedOrder },
            });
          } else {
            setFormError(verifyRes.data?.message || 'Payment verification failed');
          }
        } catch (vErr) {
          console.error('Payment verification error:', vErr);
          setFormError(vErr.response?.data?.message || 'Payment verification failed');
        } finally {
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error('Error placing order:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred while placing the order.';
      setFormError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900 flex flex-col">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grow">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 transition"
          >
            ← Back to Cart
          </Link>
        </div>

        {/* Order Placement Success View */}
        {orderSuccess ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto select-none">
              ✓
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-neutral-900">
                Order Placed Successfully!
              </h1>
              <p className="text-sm text-neutral-500">
                Thank you for your purchase. Your order ID is{' '}
                <span className="font-semibold text-neutral-800">
                  #{orderSuccess._id}
                </span>
                .
              </p>
            </div>

            <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50/50 text-left text-sm space-y-2 max-w-md mx-auto">
              <div className="flex justify-between font-medium text-neutral-700">
                <span>Deliver To:</span>
                <span className="text-neutral-900 font-semibold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between font-medium text-neutral-700">
                <span>Address:</span>
                <span className="text-neutral-900 text-right">
                  {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
                </span>
              </div>
              <div className="flex justify-between font-medium text-neutral-700 border-t border-neutral-200/60 pt-2">
                <span>Total Amount:</span>
                <span className="text-neutral-900 font-bold">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition cursor-pointer active:scale-95 shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Wireframe Card */
          <div className="bg-white border border-neutral-300 rounded-2xl shadow-sm overflow-hidden">
            {/* Header: Checkout */}
            <div className="px-6 py-4 border-b border-neutral-200 bg-white">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Checkout
              </h1>
            </div>

            {/* Form-Level Validation Error Alert */}
            {formError && (
              <div
                role="alert"
                className="mx-6 mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">⚠️</span>
                  <span className="font-medium">{formError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormError('')}
                  className="text-xs font-semibold underline cursor-pointer hover:text-rose-900"
                >
                  Dismiss
                </button>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} noValidate>
              {/* Section 1: Shipping Details */}
              <div className="p-6 border-b border-neutral-200 space-y-5">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Shipping Details
                </h2>

                <div className="space-y-4 max-w-xl">
                  {/* Full Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-neutral-700 sm:col-span-1 pt-2.5"
                    >
                      Full Name
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition ${
                          fieldErrors.fullName
                            ? 'bg-rose-50/40 border border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                            : 'bg-neutral-50/50 border border-neutral-300 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
                        }`}
                      />
                      {fieldErrors.fullName && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {fieldErrors.fullName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-neutral-700 sm:col-span-1 pt-2.5"
                    >
                      Phone Number
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition ${
                          fieldErrors.phone
                            ? 'bg-rose-50/40 border border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                            : 'bg-neutral-50/50 border border-neutral-300 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address Line */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <label
                      htmlFor="address"
                      className="text-sm font-medium text-neutral-700 sm:col-span-1 pt-2.5"
                    >
                      Address Line
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address, house/flat no."
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition ${
                          fieldErrors.address
                            ? 'bg-rose-50/40 border border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                            : 'bg-neutral-50/50 border border-neutral-300 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
                        }`}
                      />
                      {fieldErrors.address && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {fieldErrors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium text-neutral-700 sm:col-span-1 pt-2.5"
                    >
                      City
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition ${
                          fieldErrors.city
                            ? 'bg-rose-50/40 border border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                            : 'bg-neutral-50/50 border border-neutral-300 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
                        }`}
                      />
                      {fieldErrors.city && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {fieldErrors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* State */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <label
                      htmlFor="state"
                      className="text-sm font-medium text-neutral-700 sm:col-span-1 pt-2.5"
                    >
                      State
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition ${
                          fieldErrors.state
                            ? 'bg-rose-50/40 border border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                            : 'bg-neutral-50/50 border border-neutral-300 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
                        }`}
                      />
                      {fieldErrors.state && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {fieldErrors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <label
                      htmlFor="pincode"
                      className="text-sm font-medium text-neutral-700 sm:col-span-1 pt-2.5"
                    >
                      Pincode
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg outline-none transition ${
                          fieldErrors.pincode
                            ? 'bg-rose-50/40 border border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                            : 'bg-neutral-50/50 border border-neutral-300 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
                        }`}
                      />
                      {fieldErrors.pincode && (
                        <p className="text-xs text-rose-600 font-medium mt-1">
                          {fieldErrors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Order Summary */}
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Order Summary
                </h2>

                {cartItems.length === 0 ? (
                  <div className="py-6 text-center space-y-3">
                    <p className="text-sm text-neutral-500">Your cart is currently empty.</p>
                    <Link
                      to="/products"
                      className="inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Browse Products →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Item List: {Name} × {quantity}       ₹{total} */}
                    <div className="space-y-2.5">
                      {cartItems.map((item) => {
                        const product = item.product || {};
                        const name = product.name || 'Product';
                        const quantity = item.quantity || 1;
                        const price = Number(product.price) || 0;
                        const lineTotal = price * quantity;
                        const key = product._id || product || item._id;

                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between text-sm py-1"
                          >
                            <span className="font-medium text-neutral-800">
                              {name} × {quantity}
                            </span>
                            <span className="font-semibold text-neutral-900">
                              ₹{lineTotal.toLocaleString('en-IN')}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total: Total    ₹{cartTotal} */}
                    <div className="border-t border-neutral-200 pt-4 flex items-center justify-between text-base font-bold text-neutral-900">
                      <span>Total</span>
                      <span className="text-lg">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full sm:w-auto min-w-55 px-8 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition cursor-pointer active:scale-95 shadow-sm text-center"
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;
