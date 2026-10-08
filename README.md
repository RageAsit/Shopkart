# Shopkart

A full-stack, responsive e-commerce web application built on the MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS styling and integrated Razorpay payment processing.

---

## Overview

**Shopkart** is a modern e-commerce storefront designed to deliver a streamlined online shopping journey from product discovery to order fulfillment. It provides a secure, user-friendly shopping experience with real-time catalog search and category filtering, customer authentication, synchronized carts and wishlists, address validation, and payment verification.

### Problems Solved & Key Capabilities
- **Reliable Inventory & Pricing Protection**: All order prices, items, and inventory deductions are computed and verified server-side against live database records rather than trusting client-submitted values.
- **Persistent State Management**: Customer cart and wishlist items are persisted to MongoDB and synced globally via React Context, ensuring continuity across browsing sessions and devices.
- **Seamless Checkout & Payment Flow**: Integrated with Razorpay's checkout gateway (including automatic mock/simulation fallback for sandbox testing without credentials), verifying payment signatures with HMAC SHA-256 before deducting stock and clearing customer carts.
- **Order Snapshots & Tracking**: Completed orders store immutable item snapshots (capturing product name, price, and image at the time of purchase) alongside delivery addresses and payment receipts.

---

## Features

### 👤 Customer Authentication & Account Management
- **Registration & Validation**: Account creation requiring full name, email, phone number, and password (minimum 6 characters) with duplicate email prevention.
- **Secure Authentication**: Password hashing with `bcrypt` (10 salt rounds) and session issuance via JSON Web Tokens (`jsonwebtoken`).
- **Flexible Token Transport**: Supports both secure HTTP-only cookies (`token`) and `Bearer` Authorization headers.
- **Protected Profile & Route Guards**: Frontend navigation protected with dedicated `ProtectedRoute` and `PublicRoute` wrappers.
- **Password Management**: Authenticated users can update their passwords with old password verification.
- **Session Termination**: Instant logout functionality with cookie invalidation.

### 🛍️ Product Catalog & Discovery
- **Dynamic Catalog Browsing**: View available products with image previews, category tags, real-time pricing (₹ INR), and stock levels.
- **Live Search & Category Filtering**: Regex-based keyword search on product titles combined with category filtering (`Electronics`, `Fashion`, `Books`, `Home`).
- **Detailed Product View**: Dedicated product details page (`/products/:id`) featuring high-resolution visuals, item specifications, stock availability indicators, and direct add-to-cart controls.
- **Catalog Seeding**: Includes a seeding utility (`seedProducts.js`) to populate the store with realistic catalog items across multiple categories.

### 💖 Wishlist Management
- **One-Click Wishlist**: Save favorite items directly from product cards or product detail pages.
- **Duplicate Prevention**: Server enforces unique product references per customer wishlist.
- **Wishlist Sync**: Populated product references with live stock and pricing, and instant item removal.

### 🛒 Shopping Cart Management
- **Global Cart Reactivity**: Global state management powered by React Context (`CartContext`) with optimistic UI updates.
- **Database Persistence**: Cart items and quantities are directly attached to the customer document in MongoDB.
- **Quantity Adjustments**: Real-time increment and decrement controls with stock boundary checks preventing users from ordering more items than available.
- **Live Order Summaries**: Real-time dynamic calculation of item count, total units, and subtotal amounts.
- **Multi-Device Synchronization**: Cart automatically fetches and updates upon user login and clears on logout.

### 💳 Checkout & Razorpay Payment Processing
- **Address Validation**: Comprehensive client-side and server-side validation for recipient name, contact number, street address, city, state, and 6-digit postal pincode.
- **Server-Driven Order Security**: The client sends only shipping information; the server recalculates order totals from the database and verifies stock availability.
- **Razorpay Modal Checkout**: Direct integration with Razorpay Checkout SDK (`checkout.js`) displaying itemized order totals in Indian Rupees (paise conversion).
- **Simulated Payment Fallback**: Automatically switches to an integrated mock payment flow when running in local development without live Razorpay API keys, allowing full end-to-end testing.
- **Cryptographic Signature Verification**: Validates Razorpay payment signatures using HMAC SHA-256 to ensure transaction authenticity before marking orders as paid.
- **Automated Post-Payment Operations**: Automatically decrements product inventory in MongoDB, marks order status as `PLACED` / `PAID`, and empties the customer's active shopping cart.

### 📦 Order History & Confirmation
- **Instant Order Confirmation**: Dedicated `/order-success/:id` screen displaying purchase receipts, assigned order IDs, delivery addresses, and payment IDs.
- **Customer Order Dashboard**: "My Orders" screen (`/my-orders`) showing chronological order history with itemized product snapshots, quantities, purchase totals, and order fulfillment status badges.
- **Ownership Verification**: Direct order queries (`/orders/:id`) enforce ownership checks so users cannot access orders placed by others.

---

## Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** (`v19.2.8`) | Core UI library for component-based interface architecture |
| **Vite 8** (`v8.2.2`) | High-performance build tool and hot module replacement dev server |
| **React Router DOM** (`v7.18.3`) | Declarative client-side routing and protected route management |
| **Tailwind CSS v4** (`v4.3.3`) | Modern utility-first CSS framework using `@tailwindcss/vite` |
| **Axios** (`v1.20.0`) | Promise-based HTTP client configured with credentials for cookie sessions |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment (configured with ES Modules `"type": "module"`) |
| **Express.js 5** (`v5.2.1`) | Minimalist web application framework for RESTful routing and middleware |
| **Mongoose 9** (`v9.9.4`) | Object Data Modeling (ODM) library for MongoDB |
| **JSON Web Token** (`v9.0.3`) | Stateless authentication token generation and verification |
| **Bcrypt** (`v6.0.0`) | Salt generation and cryptographic hashing for user passwords |
| **Cookie-Parser** (`v1.4.7`) | Parsing HTTP cookies for credential extraction |
| **CORS** (`v2.8.6`) | Cross-Origin Resource Sharing handling with explicit origin whitelist |
| **Dotenv** (`v17.4.2`) | Environment variable loader from `.env` files |
| **Nodemon** (`v3.1.14`) | Development monitor for auto-restarting the server on file changes |

### Database
- **MongoDB**: NoSQL document database hosting customer profiles, product catalogs, and order history records.

### Authentication
- **JSON Web Tokens (JWT)**: Signed with secret key (`JWT_SECRET`), valid for 7 days, transmitted via HTTP-only, `sameSite: 'lax'` cookies and `Authorization: Bearer <token>` headers.
- **Bcrypt**: Password hashing with 10 salt rounds before persistence.

### External APIs & Payment Gateway
- **Razorpay Node SDK** (`v2.9.8`): Server-side order creation and signature handling.
- **Razorpay Checkout.js**: Client-side modal payment interface injected via `https://checkout.razorpay.com/v1/checkout.js`.

---

## Project Structure

```
SHOPKART/
├── client/
│   └── vite-project/                 # React frontend application (Vite)
│       ├── public/
│       │   └── favicon.svg           # Application favicon
│       ├── src/
│       │   ├── assets/               # Static icons and graphics
│       │   ├── axiosCalls/
│       │   │   └── axios.js          # Pre-configured Axios instance (baseURL & credentials)
│       │   ├── components/
│       │   │   ├── Navbar.jsx        # Top navigation bar with live cart/wishlist counters
│       │   │   ├── ProductCard.jsx   # Product display card with wishlist & add-to-cart actions
│       │   │   ├── ProtectedRoute.jsx# Auth route guard for authenticated pages
│       │   │   └── PublicRoute.jsx   # Route guard redirecting authenticated users to /home
│       │   ├── context/
│       │   │   ├── AuthContext.jsx   # Global customer authentication state provider
│       │   │   └── CartContext.jsx   # Global shopping cart provider & business logic
│       │   ├── Pages/
│       │   │   ├── Cart.jsx          # Shopping cart item management & totals
│       │   │   ├── Checkout.jsx      # Shipping address form & Razorpay payment integration
│       │   │   ├── Home.jsx          # Landing page with hero banner & category quick-links
│       │   │   ├── Login.jsx         # Customer login page
│       │   │   ├── MyOrders.jsx      # Historical customer orders dashboard
│       │   │   ├── OrderSuccess.jsx  # Order placement confirmation screen
│       │   │   ├── ProductDetails.jsx# Detailed product view with stock inspection
│       │   │   ├── Products.jsx      # Searchable, filterable product catalog grid
│       │   │   ├── Register.jsx      # New customer registration page
│       │   │   └── Wishlist.jsx      # Saved items view
│       │   ├── App.css               # Tailwind CSS entry imports
│       │   ├── App.jsx               # Route definitions and provider assembly
│       │   ├── index.css             # Base stylesheet
│       │   └── main.jsx              # React root DOM mounting point
│       ├── index.html                # HTML entry point including Razorpay checkout script
│       ├── package.json              # Frontend dependencies and Vite scripts
│       └── vite.config.js            # Vite configuration with React & Tailwind plugins
│
├── server/                           # Express.js REST API backend
│   ├── controllers/
│   │   ├── cart.controller.js        # Cart manipulation (add, update qty, remove, fetch)
│   │   ├── customer.controller.js    # Auth logic (register, login, me, logout, password)
│   │   ├── order.controller.js       # Order creation, Razorpay order/verify, order history
│   │   ├── product.controller.js     # Product listing, filtering, search, and retrieval
│   │   └── wishlist.controller.js    # Wishlist endpoints (add, remove, get)
│   ├── middlewares/
│   │   └── auth.middleware.js        # JWT authentication middleware (cookie & bearer)
│   ├── models/
│   │   ├── customer.model.js         # Mongoose schema for customers, carts, and wishlists
│   │   ├── order.model.js            # Mongoose schema for order records & item snapshots
│   │   ├── product.model.js          # Mongoose schema for catalog products
│   │   └── user.model.js             # Export alias for customer model
│   ├── routes/
│   │   ├── cart.routes.js            # /cart and /customers/cart routes
│   │   ├── customer.routes.js        # /customers authentication and profile routes
│   │   ├── order.routes.js           # /orders and /customers/orders routes
│   │   ├── product.routes.js         # /products catalog routes
│   │   └── wishlist.routes.js        # /wishlist and /customers/wishlist routes
│   ├── utils/
│   │   ├── generateToken.js          # Utility to sign 7-day JWT tokens
│   │   └── razorpay.js               # Razorpay client initializer with environment keys
│   ├── .env                          # Server environment configuration
│   ├── index.js                      # Express application entry, CORS, and DB connection
│   ├── package.json                  # Backend dependencies and scripts
│   └── seedProducts.js               # Database population script with sample inventory
│
├── .gitignore                        # Git exclusion rules
└── README.md                         # Project documentation
```

---

## How It Works

### High-Level Architecture Flow

```
┌────────────────────────────────┐
│      React Client (Vite)       │  Port: 5173
│  • React Router DOM (Pages)    │
│  • AuthContext & CartContext   │
│  • Axios (withCredentials)     │
└───────────────┬────────────────┘
                │ HTTP Requests (JSON + Cookies)
                ▼
┌────────────────────────────────┐
│      Express REST API Server   │  Port: 8080
│  • CORS & Cookie-Parser        │
│  • Auth Middleware (JWT)       │
│  • Controllers & Business Rules│
└───────┬────────────────┬───────┘
        │                │
        │ Mongoose       │ REST / HMAC SHA-256
        ▼                ▼
┌──────────────┐   ┌───────────────────────────┐
│   MongoDB    │   │  Razorpay Payment Gateway │
│  (Database)  │   │  (or Simulated Mock Flow) │
└──────────────┘   └───────────────────────────┘
```

### Detailed Execution Flows

#### 1. Authentication Flow
1. **User Registration / Login**: The customer submits credentials via `Register.jsx` or `Login.jsx`.
2. **Server Verification**: The backend validates fields, hashes passwords via `bcrypt` during registration, or compares hashes during login.
3. **Session Issuance**: Upon successful verification, `generateToken.js` signs a JWT containing the user's ID. The server attaches an HTTP-only cookie (`token`) to the response and returns user data.
4. **App Initialization**: On page load, `AuthContext.jsx` queries `GET /customers/me`. If a valid token exists in cookies, user state is set; otherwise, state resets to unauthenticated.
5. **Route Protection**: `ProtectedRoute` verifies active authentication before rendering restricted pages, redirecting unauthenticated visitors to `/login`.

#### 2. Product Search & Catalog Flow
1. **Catalog Query**: Visiting `/products` triggers `GET /products` with optional query parameters (`?search=...` and `?category=...`).
2. **Database Query**: `product.controller.js` compiles a dynamic MongoDB query using case-insensitive regex for product names and category matching.
3. **Product Inspection**: Clicking an item navigates to `/products/:id`, fetching the full product record via `GET /products/:id`.

#### 3. Cart & Wishlist Synchronization
1. **Adding to Cart**: When a user clicks "Add to Cart", `CartContext` optimistically updates local UI state and sends `POST /cart/:productId`.
2. **Stock Verification**: The server verifies that the product exists and that `quantity <= product.stock` before saving the updated cart array directly on the `Customer` document.
3. **Quantity Mutation**: `PATCH /cart/:productId` updates the quantity, rejecting requests that exceed available inventory.
4. **Wishlist Toggling**: `POST /wishlist/:productId` adds product ObjectIds to the customer's `wishlist` array, while `DELETE /wishlist/:productId` removes them.

#### 4. Checkout, Payment & Order Fulfillment Flow
```
User (Checkout Page)             Backend (/orders)              Razorpay Gateway              MongoDB
         │                              │                              │                         │
         │─── POST shippingAddress ────>│                                                        │
         │                              │─── Read Live Cart & Stock ────────────────────────────>│
         │                              │<── Latest Products & Prices ───────────────────────────│
         │                              │                                                        │
         │                              │─── Create Order (Status: Pending) ────────────────────>│
         │                              │─── Init Razorpay Order (Paise) ─>│                     │
         │                              │<── Razorpay Order ID ────────────│                     │
         │<── Checkout & Order Details ─│                                                        │
         │                                                                                       │
         │─── Open Razorpay Modal ────────────────────────────────────>│                         │
         │<── Payment Success (ID + Signature) ────────────────────────│                         │
         │                                                                                       │
         │─── POST /orders/verify-payment ─────────────────────────────>│                         │
         │    (Order ID, Payment ID, Signature)                         │                        │
         │                                                              │── Verify HMAC SHA256   │
         │                                                              │── Order -> PLACED      │
         │                                                              │── Payment -> PAID      │
         │                                                              │── Decrement Stock ────>│
         │                                                              │── Clear User Cart ────>│
         │<── Confirmed Order JSON ─────────────────────────────────────│                        │
         │                                                                                       │
         │─── Navigate to /order-success/:id                                                     │
```

1. **Address Submission**: The user completes the shipping form in `Checkout.jsx`. Client-side validation checks all fields.
2. **Payment Order Creation**: The frontend sends only the recipient's address to `POST /orders/create-payment-order`.
3. **Server Price & Stock Recalculation**: The backend re-queries the database for every item in the user's cart, verifies real-time stock levels, and computes the exact total.
4. **Order Document Creation**: The server creates an `Order` document with status `'Pending'`, payment status `'Pending'`, and detailed item snapshots.
5. **Gateway Initialization**:
   - If valid `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are provided, the backend initializes a real order via the Razorpay SDK.
   - If placeholder or missing credentials are detected, the backend produces a mock order ID, allowing complete offline/sandbox testing.
6. **Payment Execution**:
   - In production/test mode with Razorpay credentials, the Razorpay UI modal opens. Upon completion, it returns `razorpay_payment_id` and `razorpay_signature`.
   - In mock mode, the frontend seamlessly transitions to the verification endpoint with a simulated payload.
7. **Verification & Fulfillment**:
   - The client posts verification parameters to `POST /orders/verify-payment`.
   - The backend validates the HMAC SHA-256 signature against `RAZORPAY_KEY_SECRET`.
   - Upon verification, the order status changes to `PLACED`, payment status to `PAID`, product inventory counts are decremented via `$inc: { stock: -quantity }`, and the customer's cart is emptied.
8. **Confirmation**: The client clears its local `CartContext` and redirects the customer to `/order-success/:id`.

---

## API Reference

### Authentication & Customer (`/customers`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/customers/register` | No | Register new customer (`fullName`, `email`, `password`, `phone`) |
| `POST` | `/customers/login` | No | Login customer (`email`, `password`); sets HTTP-only cookie |
| `GET` | `/customers/me` | Yes | Retrieve authenticated customer profile |
| `POST` | `/customers/logout` | No | Clear authentication cookie session |
| `PATCH` | `/customers/change-password` | Yes | Update password (`oldPassword`, `newPassword`) |

### Products (`/products`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/products` | No | Fetch all products (supports `?search=` and `?category=`) |
| `GET` | `/products/:id` | No | Get details for a single product by MongoDB ID |
| `POST` | `/products` | No | Create a new product (`name`, `description`, `price`, `category`, `image`, `stock`) |

### Shopping Cart (`/cart` & `/customers/cart`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/cart` | Yes | Get current user's populated cart and item quantities |
| `POST` | `/cart/:productId` | Yes | Add item to cart or increment quantity |
| `PATCH` | `/cart/:productId` | Yes | Update item quantity in cart (`quantity`) |
| `PUT` | `/cart/:productId` | Yes | Update item quantity in cart (`quantity`) |
| `DELETE` | `/cart/:productId` | Yes | Remove item completely from cart |

### Wishlist (`/wishlist` & `/customers/wishlist`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/wishlist` | Yes | Retrieve current user's populated wishlist |
| `POST` | `/wishlist/:productId` | Yes | Add item to user's wishlist |
| `DELETE` | `/wishlist/:productId` | Yes | Remove item from user's wishlist |

### Orders & Checkout (`/orders` & `/customers/orders`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/orders` | Yes | Validate cart, verify stock, and initialize Razorpay order |
| `POST` | `/orders/create-payment-order` | Yes | Alias for payment order initialization |
| `POST` | `/orders/verify-payment` | Yes | Verify HMAC signature, finalize order, deduct stock, and empty cart |
| `GET` | `/orders` | Yes | Retrieve all orders placed by the authenticated customer |
| `GET` | `/orders/my-orders` | Yes | Alias to fetch authenticated customer's order history |
| `GET` | `/orders/:id` | Yes | Fetch single order details (ownership verified) |

---

## Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js**: `v18.0.0` or higher (recommended: LTS `v20.x` or `v22.x`)
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)
- **MongoDB**: A running local MongoDB daemon (`mongodb://localhost:27017/ShopKart`) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud connection string.
- **Razorpay Account (Optional)**: A Razorpay test account key pair if you wish to test real test-mode gateway popups. *(Not required for development, as a mock payment fallback is built-in).*

---

## Installation & Setup

Follow these step-by-step instructions to run Shopkart on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Shopkart.git
cd Shopkart
```

---

### 2. Configure Environment Variables

Navigate to the `server/` directory and configure the environment variables:

```bash
cd server
```

Create or edit your `.env` file inside the `server/` folder:

```env
# MongoDB Connection String (Atlas URI or Local MongoDB)
dbUrl=mongodb+srv://<username>:<password>@cluster.mongodb.net/ShopKart

# JSON Web Token Secret
JWT_SECRET=your_jwt_secret_key_here

# Optional: Razorpay Test API Keys (leave blank or placeholder to use built-in mock payment)
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
```

---

### 3. Install Backend Dependencies & Start the Server

From the `server/` directory:

```bash
# Install backend dependencies
npm install

# Seed the database with sample products (optional, recommended for initial setup)
npm run seed

# Start the backend server
node index.js
```

> **Tip:** You can also run the server using `npx nodemon index.js` for automatic reloads on file changes during development.

The server will start on:
```
http://localhost:8080
```

---

### 4. Install Frontend Dependencies & Start the Client

Open a new terminal window, navigate to the frontend directory (`client/vite-project/`), and launch the development server:

```bash
# Navigate to the Vite client project
cd client/vite-project

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend application will start and will typically be available at:
```
http://localhost:5173
```

Open your browser and navigate to `http://localhost:5173` to explore Shopkart.

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Default / Fallback | Description |
| :--- | :---: | :--- | :--- |
| `dbUrl` | **Yes** | *None* | MongoDB connection URI string (e.g. MongoDB Atlas or local MongoDB instance) |
| `JWT_SECRET` | **Yes** | *None* | Secret key used to sign and verify JSON Web Tokens for authentication |
| `RAZORPAY_KEY_ID` | No | `rzp_test_placeholder` | Razorpay Key ID for processing payments. If omitted or set to placeholder, mock payment mode activates automatically. |
| `RAZORPAY_KEY_SECRET` | No | `rzp_test_placeholder_secret` | Razorpay Key Secret used for server-side HMAC SHA-256 signature verification. |
| `API_URL` | No | `http://localhost:8080` | Base URL used exclusively by the `seedProducts.js` utility script to insert sample catalog data. |

### Frontend (`client/vite-project`)

The frontend Axios client is preconfigured in `client/vite-project/src/axiosCalls/axios.js` to communicate with:
```javascript
baseURL: 'http://localhost:8080',
withCredentials: true
```
Ensure your backend server is running on port `8080` so the client can establish communication and exchange credentials seamlessly.

---

## Available Scripts

### Backend (`server/`)
- `npm run seed`: Runs `node seedProducts.js` to seed sample products across Electronics, Fashion, and other categories via the `POST /products` endpoint.
- `node index.js`: Starts the Express server on port `8080`.
- `npx nodemon index.js`: Starts the server with live reloading.

### Frontend (`client/vite-project/`)
- `npm run dev`: Starts the Vite local development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles production-ready assets into the `dist/` directory.
- `npm run preview`: Locally previews the production build output.
- `npm run lint`: Runs ESLint across project source files to check code quality.

---

## Database Schemas

### Customer Schema (`server/models/customer.model.js`)
```javascript
{
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String, required: true },
  wishlist: [{ type: ObjectId, ref: 'Product' }],
  cart: [
    {
      product:  { type: ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
}
```

### Product Schema (`server/models/product.model.js`)
```javascript
{
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: > 0 },
  category:    { type: String, required: true },
  image:       { type: String, required: false },
  stock:       { type: Number, required: true, min: 0 },
  createdAt:   { type: Date, default: Date.now }
}
```

### Order Schema (`server/models/order.model.js`)
```javascript
{
  user: { type: ObjectId, ref: 'Customer', required: true },
  items: [
    {
      product:  { type: ObjectId, ref: 'Product', required: true },
      name:     { type: String, required: true },
      price:    { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      image:    { type: String, default: '' }
    }
  ],
  shippingAddress: {
    fullName:     String,
    phone:        String,
    addressLine1: String,
    city:         String,
    state:        String,
    pincode:      String
  },
  totalAmount:       { type: Number, required: true, min: 0 },
  status:            { type: String, default: 'Pending' }, // 'Pending' -> 'PLACED'
  paymentStatus:     { type: String, default: 'Pending' }, // 'Pending' -> 'PAID'
  razorpayOrderId:   { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  createdAt:         { type: Date, default: Date.now }
}
```

---

## License

This project is licensed under the [ISC License](file:///c:/Users/asito/Desktop/MY%20FOLDERS/SHOPKART/server/package.json).
