import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addToCart, getCart, updateCartQuantity, removeFromCart } from "../controllers/cart.controller.js";

const cartRoutes = express.Router();

// GET /cart - Get current user's cart
cartRoutes.get("/", authMiddleware, getCart);

// POST /cart/:productId - Add product to cart
cartRoutes.post("/:productId", authMiddleware, addToCart);

// PATCH /cart/:productId - Update product quantity in cart
cartRoutes.patch("/:productId", authMiddleware, updateCartQuantity);
cartRoutes.put("/:productId", authMiddleware, updateCartQuantity);

// DELETE /cart/:productId - Remove product from cart
cartRoutes.delete("/:productId", authMiddleware, removeFromCart);

export default cartRoutes;

