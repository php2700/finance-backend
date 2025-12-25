import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../envconfig.js';

export const authentication = (req, res, next) => {
    const token = req?.headers['authorization'].split(" ")[1];
    if (token) {
        const isVerifyUser = jwt.verify(token, JWT_SECRET_KEY);
        if (isVerifyUser) {
            req.role = isVerifyUser?.role;
           return next();
        }
        return res.status(400).json({ success: false, message: 'token not valid' })

    }
    return res.status(400).json({ success: false, message: 'token not found' })
}