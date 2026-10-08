import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// POST /wishlist/:productId - Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const user = req.user || req.customer;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { productId } = req.params;

    // 1. Validate productId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 2. Find Product in database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 3. Check if already in wishlist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const isAlreadyWishlisted = user.wishlist.some((item) => {
      const itemId = item._id ? item._id.toString() : item.toString();
      return itemId === productId.toString();
    });

    if (isAlreadyWishlisted) {
      return res.status(409).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // 4. Add Product ObjectId and save user
    user.wishlist.push(product._id);
    await user.save();

    // 5. Return success
    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /wishlist - Get current user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = req.user || req.customer;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userWithWishlist = await Customer.findById(user._id).populate({
      path: "wishlist",
      select: "name price category image stock",
    });

    if (!userWithWishlist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const populatedWishlist = (userWithWishlist.wishlist || []).filter(
      (item) => item !== null
    );

    return res.status(200).json({
      success: true,
      count: populatedWishlist.length,
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE /wishlist/:productId - Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const user = req.user || req.customer;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { productId } = req.params;

    // 1. Validate productId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 2. Check if product exists in user's wishlist
    if (!user.wishlist || user.wishlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist",
      });
    }

    const itemIndex = user.wishlist.findIndex((item) => {
      const itemId = item._id ? item._id.toString() : item.toString();
      return itemId === productId.toString();
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist",
      });
    }

    // 3. Remove product reference
    user.wishlist.splice(itemIndex, 1);
    await user.save();

    // 4. Return success
    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


