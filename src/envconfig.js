import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 3012;
// export const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
if (!process.env.JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY missing in env');
}
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
export const JWT_ALGORITHM = process.env.JWT_ALGORITHM;
export const CONNECT_URI = process.env.CONNECT_URI;
