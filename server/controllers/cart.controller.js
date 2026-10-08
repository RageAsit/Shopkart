import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";

// POST /cart/:productId - Add product to cart
export const addToCart = async (req, res) => {
  try {
    // 1. Authenticate User
    const user = req.user || req.customer;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Validate Product ID
    const productId = req.params.productId || req.body?.productId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 3. Find Product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Ensure cart array exists
    if (!user.cart) {
      user.cart = [];
    }

    // 4. Check if Product is In Cart?
    const cartItem = user.cart.find((item) => {
      const itemId = item.product?._id ? item.product._id.toString() : item.product?.toString();
      return itemId === productId.toString();
    });

    const currentQuantity = cartItem ? cartItem.quantity : 0;
    const newQuantity = currentQuantity + 1;

    // 5. Stock Available? (The new quantity must not exceed product stock)
    const availableStock = typeof product.stock === "number" ? product.stock : 0;
    if (newQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Update or Add to Cart
    if (cartItem) {
      cartItem.quantity = newQuantity;
    } else {
      user.cart.push({
        product: product._id,
        quantity: 1,
      });
    }

    // 6. Save User
    await user.save();

    // 7. Return Updated Cart
    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /cart - Get current user's cart
export const getCart = async (req, res) => {
  try {
    // 1. Authenticate the user
    const user = req.user || req.customer;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Load the authenticated user & 3. Populate each cart item's Product
    const userWithCart = await Customer.findById(user._id).populate({
      path: "cart.product",
    });

    if (!userWithCart) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Filter out items whose referenced product might have been removed
    const populatedCart = (userWithCart.cart || []).filter(
      (item) => item.product !== null && item.product !== undefined
    );

    // 4. Return cart items with quantity
    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PATCH /cart/:productId - Update product quantity in cart
export const updateCartQuantity = async (req, res) => {
  try {
    // 1. Authenticate User (Scenario: Not logged in -> 401)
    const user = req.user || req.customer;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Validate Product ID (Scenario: Invalid product ID -> 400)
    const productId = req.params.productId || req.body?.productId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 3. Find Product (Scenario: Product not found -> 404)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 4. Product must already exist in cart (Scenario: Product not in cart -> 404)
    if (!user.cart) {
      user.cart = [];
    }

    const cartItem = user.cart.find((item) => {
      const itemId = item.product?._id ? item.product._id.toString() : item.product?.toString();
      return itemId === productId.toString();
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    // 5. Validate Quantity (Scenario: Quantity < 1 or not a number -> 400)
    const { quantity } = req.body;
    if (typeof quantity !== "number" || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number and at least 1",
      });
    }

    // 6. Quantity must not exceed Product stock (Scenario: Quantity > stock -> 400)
    const availableStock = typeof product.stock === "number" ? product.stock : 0;
    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }

    // Update quantity & save
    cartItem.quantity = quantity;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateQuantity = updateCartQuantity;

// DELETE /cart/:productId - Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    // 1. Authenticate user
    const user = req.user || req.customer;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Validate productId
    const productId = req.params.productId || req.body?.productId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 3. Check if cart exists and has items
    if (!user.cart || user.cart.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    const itemIndex = user.cart.findIndex((item) => {
      const itemId = item.product?._id ? item.product._id.toString() : item.product?.toString();
      return itemId === productId.toString();
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    // 4. Remove item from cart
    user.cart.splice(itemIndex, 1);
    await user.save();

    // 5. Return updated cart
    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteFromCart = removeFromCart;



