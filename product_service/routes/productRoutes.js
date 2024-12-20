const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getProduct, 
  editProduct, 
  deleteProduct, 
  searchProducts 
} = require('../controllers/productController'); // Destructure the controller functions
// const authenticateJWT = require('../middleware/authMiddleware');
const multer = require('multer');

// Set up multer for handling file uploads (images)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Routes
router.post('/create', upload.single('image'), createProduct);  // Create product
router.get('/:product_id', getProduct);  // Get product by ID
router.put('/:id',  upload.single('image'), editProduct);  // Edit product
// router.delete('/:id', authenticateJWT, deleteProduct);  // Delete product
// router.get('/search', searchProducts);  // Search products

module.exports = router;
