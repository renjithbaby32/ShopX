import express from 'express'
const router = express.Router()
import {
  getProducts,
  getTopProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductsByCategory,
  createProductReview,
  getProductsOnDiscount,
  getAllProductsForReport,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/report').get(getAllProductsForReport)

router.route('/top').get(getTopProducts)
router.route('/productsOnDiscount').get(getProductsOnDiscount)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)
router.route('/category/:id').get(getProductsByCategory)
router.route('/:id/reviews').post(protect, createProductReview)
export default router
