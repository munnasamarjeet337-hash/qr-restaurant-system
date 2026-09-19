import express from 'express';
import {
  getAllTables,
  getTableByNumber,
  requestBill,
  settleTableBill,
  resetDatabase
} from '../controllers/tableController.js';

const router = express.Router();

router.get('/', getAllTables);
router.get('/:tableNumber', getTableByNumber);
router.post('/:tableNumber/request-bill', requestBill);
router.post('/:tableNumber/settle', settleTableBill);
router.post('/admin/reset', resetDatabase);

export default router;
