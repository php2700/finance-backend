import { PORT } from './src/envconfig.js';

import express from 'express';
import cors from 'cors';
import adminRouter from './src/Routes/adminRoute.js';
import userRouter from './src/Routes/userRoute.js';
import incomeCategoryRoute from './src/Routes/incomeCategoryRoute.js';
import expenseCategoryRoute from './src/Routes/expenseCategory.routes.js';
import ConnectDb from './db/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import e from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
ConnectDb();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/income-category', incomeCategoryRoute);
app.use('/api/expense-category', expenseCategoryRoute);
app.get('/', (req, res) => {
  res.send('API is running.... on post 3012');
});

//  FIXED ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('ERROR:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log('server is running');
});
