import express from 'express';
import { getCategories, getMenuItems, getMenuItemById } from '../controllers/menuController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/menu', getMenuItems);
router.get('/menu/:id', getMenuItemById);

export default router;
