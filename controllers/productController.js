const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

//get all products
const getProducts = asyncHandler(async (req, res) => {
  //setup pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  //query parameters
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  //count total documents
  const count = await Product.countDocuments({ ...keyword });
  
  //get products
  const products = await Product.find({ ...keyword })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count,
    pages: Math.ceil(count / limit),
    currentPage: page,
    products,
  });
});

//get single product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json({
      success: true,
      product,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//create a product function
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity } = req.body;

  //create product
  const product = await Product.create({
    user: req.user._id,
    name,
    description,
    price,
    category,
    quantity,
  });

  if (product) {
    res.status(201).json({
      success: true,
      product,
    });
  } else {
    res.status(400);
    throw new Error('Invalid product data');
  }
});

//update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock, quantity } = req.body;

  //find product by ID
  const product = await Product.findById(req.params.id);

  if (product) {
    //check if user owns the product or is admin
    if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }

    //update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.quantity = quantity !== undefined ? quantity : product.quantity;

    //save updated product
    const updatedProduct = await product.save();

    res.json({
      success: true,
      product: updatedProduct,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  //find product by ID
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user owns the product or is admin
    if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    //remove the product
    await Product.deleteOne({ _id: product._id });

    res.json({
      success: true,
      message: 'Product removed',
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};