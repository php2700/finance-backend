import AdminModel from '../Models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  JWT_ALGORITHM,
  JWT_EXPIRE_TIME,
  JWT_SECRET_KEY,
} from '../envconfig.js';

const checkPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

const generateToken = (userData) => {
  return jwt.sign({ id: userData._id, role: userData.role }, JWT_SECRET_KEY, {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_EXPIRE_TIME,
  });
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const isExistEmail = await AdminModel.findOne({ email });

    if (!isExistEmail) {
      return res.status(404).json({
        success: false,
        message: 'Email not valid',
      });
    }

    const isPasswordCorrect = await checkPassword(
      password,
      isExistEmail.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = generateToken(isExistEmail);

    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: {
        _id: isExistEmail._id,
        role: isExistEmail.role,
        email: isExistEmail.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
