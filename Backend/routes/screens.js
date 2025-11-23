import express from 'express';
import { authenticate, requireEditor } from '../middleware/auth.js';
import { screenSchema } from '../validation/schemas.js';
import Screen from '../Models/screens.js';

const router = express.Router();

// GET /screens?search=&page=&limit=
router.get('/', authenticate, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    
    const query = search 
      ? { $text: { $search: search } }
      : {};

    const screens = await Screen.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('_id name isActive createdAt');

    const total = await Screen.countDocuments(query);

    res.json({
      screens,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get screens error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /screens/:id - toggle isActive
router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id);
    
    if (!screen) {
      return res.status(404).json({ error: 'Screen not found' });
    }

    screen.isActive = !screen.isActive;
    await screen.save();

    res.json({ 
      message: 'Screen updated successfully',
      screen: {
        _id: screen._id,
        name: screen.name,
        isActive: screen.isActive
      }
    });
  } catch (error) {
    console.error('Update screen error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;