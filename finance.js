import { PORT } from './src/envconfig.js';

import express from 'express';
import cors from 'cors'
import adminRouter from './src/Routes/adminRoute.js';
import userRouter from './src/Routes/userRoute.js';
import ConnectDb from './db/index.js';
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
app.use(cors())
app.use(express.json())
ConnectDb()
app.use("/public", express.static(path.join(__dirname, "public")))
app.use('/uploads', express.static('public/uploads'));

app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.use((err, req, res, next) => {
    res.status(res.status || 500).json({ success: true, message: err?.message || 'something went wrong' })
})

app.listen(PORT, () => {
    console.log('server is running')
})