import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const wishlistRoutes = express.Router();

// GET /wishlist - Get current user's wishlist
wishlistRoutes.get("/", authMiddleware, getWishlist);

// POST /wishlist/:productId - Add product to wishlist
wishlistRoutes.post("/:productId", authMiddleware, addToWishlist);

// DELETE /wishlist/:productId - Remove product from wishlist
wishlistRoutes.delete("/:productId", authMiddleware, removeFromWishlist);

export default wishlistRoutes;

