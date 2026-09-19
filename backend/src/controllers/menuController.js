import { db } from '../models/db.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const { categoryId, availableOnly } = req.query;
    const items = await db.getMenuItems({
      categoryId,
      availableOnly: availableOnly === 'true'
    });
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu items', error: error.message });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.getMenuItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching menu item by id:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu item', error: error.message });
  }
};
