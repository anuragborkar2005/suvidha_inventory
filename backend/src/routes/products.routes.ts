import { Router } from 'express';
import { asyncHandler } from '../utils/asynHandler.js';
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateStockThreshold,
} from '../controllers/products.controller.js';

const router = Router();

router.route('/product').post(asyncHandler(addProduct));
router.route('/product/:id').patch(asyncHandler(updateProduct));
router.route('/product/threshold/:id').patch(asyncHandler(updateStockThreshold));
router.route('/product/:id').delete(asyncHandler(deleteProduct));
router.route('/product/all').get(asyncHandler(getProducts));
router.route('/product/:id').get(asyncHandler(getProduct));

export { router as productRouter };
