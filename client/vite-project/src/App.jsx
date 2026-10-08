import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './Pages/Login'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Products from './Pages/Products'
import ProductDetails from './Pages/ProductDetails'
import Wishlist from './Pages/Wishlist'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import OrderSuccess from './Pages/OrderSuccess'
import MyOrders from './Pages/MyOrders'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'                        

function App() {


  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
            <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
            <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
            <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
            <Route path='/products' element={<Products/>}/>
            <Route path='/products/:id' element={<ProductDetails/>}/>
            <Route path='/wishlist' element={<ProtectedRoute><Wishlist/></ProtectedRoute>}/>
            <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
            <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
            <Route path='/order-success/:id' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
            <Route path='/orders/:id' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
            <Route path='/orders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
            <Route path='/my-orders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
