import express from 'express';
import { authenticate, requireEditor } from '../middleware/auth.js';
import { playlistSchema } from '../validation/schemas.js';
import Playlist from '../Models/playlist.js';

const router = express.Router();

// GET /playlists?search=&page=&limit=
router.get('/', authenticate, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    
    const query = search 
      ? { $text: { $search: search } }
      : {};

    const playlists = await Playlist.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('_id name itemUrls createdAt');

    const playlistsWithCount = playlists.map(playlist => ({
      _id: playlist._id,
      name: playlist.name,
      itemCount: playlist.itemUrls.length,
      createdAt: playlist.createdAt
    }));

    const total = await Playlist.countDocuments(query);

    res.json({
      playlists: playlistsWithCount,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /playlists
router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const { error } = playlistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, itemUrls = [] } = req.body;

    if (itemUrls.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 URLs allowed' });
    }

    const playlist = new Playlist({
      name,
      itemUrls: itemUrls.filter(url => url.trim() !== '')
    });

    await playlist.save();

    res.status(201).json({
      message: 'Playlist created successfully',
      playlist: {
        _id: playlist._id,
        name: playlist.name,
        itemCount: playlist.itemUrls.length,
        itemUrls: playlist.itemUrls
      }
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;