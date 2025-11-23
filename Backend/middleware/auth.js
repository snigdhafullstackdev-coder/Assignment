import jwt from 'jsonwebtoken';
import User from '../Models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const requireEditor = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR') {
    return res.status(403).json({ error: 'Access denied. Editor role required.' });
  }
  next();
};