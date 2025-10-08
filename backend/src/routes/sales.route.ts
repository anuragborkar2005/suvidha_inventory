import { Router } from 'express';
import { addSales, getSales } from '../controllers/sales.controller.js';

const router = Router();

router.route('/sales').post(addSales);
router.route('/sales').get(getSales);

export { router as salesRouter };
