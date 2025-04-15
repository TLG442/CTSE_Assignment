const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

//get product routes
router.get('/', getProducts);
router.get('/:id', getProductById);

//create product
router.post('/', protect, createProduct);

//update product
router.put('/:id', protect, updateProduct);

//delete product
router.delete('/:id', protect, deleteProduct);

module.exports = router;