import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../envconfig.js';

export const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
