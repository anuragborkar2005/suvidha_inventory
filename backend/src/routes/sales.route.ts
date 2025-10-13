import { Router } from 'express';
import {
  addSales,
  getSales,
  exportSalesToExcel,
  exportSalesToCSV,
} from '../controllers/sales.controller.js';

const router = Router();

router.route('/sales').post(addSales);
router.route('/sales').get(getSales);
router.route('/sales/report').get(exportSalesToExcel);
router.route('/sales/report/csv').get(exportSalesToCSV);

export { router as salesRouter };
