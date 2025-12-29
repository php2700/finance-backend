// import User from '../Models/userModel.js';

// import jwt from 'jsonwebtoken';
// import { JWT_SECRET_KEY } from '../envconfig.js';

// export const authentication = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     console.log('AUTH HEADER:', authHeader);
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Token missing' });
//     }

//     const token = authHeader.split(' ')[1];
//     console.log('TOKEN:', token);
//     const decoded = jwt.verify(token, JWT_SECRET_KEY);
//     console.log('DECODED:', decoded);
//     //  CHECK TOKEN IN DB
//     const user = await User.findOne({
//       _id: decoded.id,
//       'tokens.token': token,
//     });

//     console.log('USER FOUND:', !!user);
//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: 'Session expired. Please login.' });
//     }

//     req.userId = user._id;
//     req.role = user.role || 'user'; // 👈 THIS WAS MISSING
//     req.token = token;
//     next();
//   } catch (error) {
//     console.error('AUTH ERROR:', error.message);
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

import User from '../Models/userModel.js';
import Admin from '../Models/adminModel.js'; 
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../envconfig.js';

export const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('AUTH HEADER:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];
    console.log('TOKEN:', token);

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log('DECODED:', decoded);

    let account = null;

    // 🔥 ROLE BASED LOOKUP
    if (decoded.role === 'admin') {
      account = await Admin.findById(decoded.id);
    } else {
      account = await User.findById(decoded.id);
    }

    console.log('ACCOUNT FOUND:', !!account);

    if (!account) {
      return res
        .status(401)
        .json({ message: 'Account not found. Please login again.' });
    }

    req.userId = account._id;
    req.role = decoded.role; // 🔥 source of truth
    req.token = token;

    next();
  } catch (error) {
    console.error('AUTH ERROR:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
