import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'others';

    // 🔥 route ke base par folder decide karo
    if (req.baseUrl.includes('income-category')) {
      folder = 'income-category';
    } else if (req.baseUrl.includes('expense-category')) {
      folder = 'expense-category';
    } else if (req.baseUrl.includes('/user')) {
      // ✅ USER PROFILE IMAGE
      folder = 'profile';
    }

    const uploadPath = path.join('public/uploads', folder);

    // folder exist nahi karta to create karo
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default upload;
