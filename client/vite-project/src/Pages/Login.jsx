import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../axiosCalls/axios.js";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { setCustomer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/customers/login", form);
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      setCustomer(res.data.customerData);
      console.log("User Logged in successfully");
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans antialiased text-neutral-900">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 text-white mb-4">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-light tracking-tight text-neutral-900">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <form className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-150"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wider text-neutral-500"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-150"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none active:scale-[0.99] transition-all duration-150 cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
