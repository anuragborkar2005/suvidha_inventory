import { Router } from 'express';
import { asyncHandler } from '../utils/asynHandler.js';
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/products.controller.js';

const router = Router();

router.route('/product').post(asyncHandler(addProduct));
router.route('/product/:id').patch(asyncHandler(updateProduct));
router.route('/product').delete(asyncHandler(deleteProduct));
router.route('/product').get(asyncHandler(getProduct));
router.route('/product/all').get(asyncHandler(getProducts));

export { router as productRouter };
