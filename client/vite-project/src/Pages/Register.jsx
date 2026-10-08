import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js';




function Register() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
  fullName: "",
  email: "",
  phone: "",
  password: "",
});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axiosInstance.post("/customers/register", form);
      console.log("User Registered");
      navigate('/login')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-12 text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 border border-zinc-200/80 rounded-2xl shadow-sm">
        {/* Brand / Logo & Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
            Storefront
          </span>
          <h1 className="text-2xl font-light tracking-tight text-zinc-900 mt-2">
            Create an Account
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Enjoy seamless checkout, order tracking, and member perks.
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Jane Doe"
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:bg-white focus:border-zinc-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:bg-white focus:border-zinc-900 transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:bg-white focus:border-zinc-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:bg-white focus:border-zinc-900 transition-colors"
            />
            <span className="block text-[11px] text-zinc-400 mt-1">
              Must be at least 6 characters
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Create Account
          </button>
        </form>

        {/* Footer / Switch to Login */}
        <div className="mt-8 text-center border-t border-zinc-100 pt-6">
          <p className="text-xs text-zinc-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;