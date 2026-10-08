import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controllers/product.controller.js';

const productRoutes = express.Router();

// GET /products - Get all products
productRoutes.get('/', getAllProducts);

// GET /products/:id - Get single product by ID
productRoutes.get('/:id', getProductById);

// POST /products - Insert product into MongoDB
productRoutes.post('/', createProduct);

export default productRoutes;
