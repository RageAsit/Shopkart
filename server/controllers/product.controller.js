import mongoose from 'mongoose';
import Product from "../models/product.model.js";

// CREATE PRODUCT (POST /products)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // 1. Check for missing required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      price === null ||
      !category ||
      !image ||
      stock === undefined ||
      stock === null ||
      (typeof name === "string" && name.trim() === "") ||
      (typeof description === "string" && description.trim() === "") ||
      (typeof category === "string" && category.trim() === "") ||
      (typeof image === "string" && image.trim() === "")
    ) {
      return res.status(400).json({
        message:
          "All fields (name, description, price, category, image, stock) are required",
      });
    }

    // 2. Validate price (must be a number and greater than 0)
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    // 3. Validate stock (must be a number and cannot be negative)
    const numericStock = Number(stock);
    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    // 4. Create product in database
    const product = await Product.create({
      name: typeof name === "string" ? name.trim() : name,
      description:
        typeof description === "string" ? description.trim() : description,
      price: numericPrice,
      category: typeof category === "string" ? category.trim() : category,
      image: typeof image === "string" ? image.trim() : image,
      stock: numericStock,
    });

    // 5. Return status 201 with the created product
    return res.status(201).json(product);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Error creating product:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL PRODUCTS (GET /products, supports ?search=... & ?category=...)
export const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Build query object dynamically based on provided query parameters
    const query = {};

    // 1. Case-insensitive search on name
    if (search && search.trim()) {
      const safeSearch = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.name = { $regex: safeSearch, $options: 'i' };
    }

    // 2. Category filter
    if (category && category.trim()) {
      const safeCategory = category.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.category = { $regex: new RegExp(`^${safeCategory}$`, 'i') };
    }

    // Exclude unnecessary fields (description, createdAt, __v) as required by the UI
    const products = await Product.find(query).select('_id name price category image stock');

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// GET SINGLE PRODUCT (GET /products/:id)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    // 2. Find product by ID
    const product = await Product.findById(id);

    // 3. Return 404 if product does not exist
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    // 4. Return status 200 with the product
    return res.status(200).json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    console.error('Error fetching single product:', error);
    return res.status(500).json({
      message: 'Server error',
    });
  }
};
