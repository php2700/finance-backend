import AdminModel from "../Models/adminModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_ALGORITHM, JWT_EXPIRE_TIME, JWT_SECRET_KEY } from "../envconfig.js";

const checkPassword = async (password, hashPassword) => {
    const verifyPassword = await bcrypt.compare(password, hashPassword);
    if (verifyPassword) return verifyPassword;
    throw new Error('Email and Password wrong')
}
const generateToken = async (userData) => {
    const token = await jwt.sign({ id: userData?.id, role: userData?.role }, JWT_SECRET_KEY, { algorithm: JWT_ALGORITHM, expiresIn: JWT_EXPIRE_TIME });
    if (token) return token;
    throw new Error('something went wrong')

}

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req?.body;
        const isExistEmail = await AdminModel.findOne({ email: email });
        if (!isExistEmail) return res.status(404).json({ success: false, message: 'email not valid' })
        await checkPassword(password, isExistEmail?.password);
        const token = await generateToken(isExistEmail);
        const userData = {
            _id: isExistEmail?._id,
            role: isExistEmail?.role,
            token: token
        }
        return res.status(200).json({ message: 'login-successfully', data: userData })
    } catch (error) {
        next(error);
    }
}