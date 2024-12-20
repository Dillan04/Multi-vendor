const { Pool } = require('pg');
const { Client } = require('@elastic/elasticsearch');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Initialize database pool

console.log('Database URL:postgres://postgres:FOOJOI1997@localhost:5432/product_service_db', process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Elasticsearch client
const esClient = new Client({ node: process.env.ELASTICSEARCH_URL });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Create product
const createProduct = async (req, res) => {
  const { seller_id, title, description, price, stock_quantity } = req.body;

  // Image URL upload to Cloudinary if image exists
  const image_url = req.file ? await uploadImageToCloudinary(req.file) : null;

  try {
    // Insert product into the database
    const result = await pool.query(
      'INSERT INTO Products (seller_id, title, description, price, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [seller_id, title, description, price, image_url, stock_quantity]
    );

    // Index product in Elasticsearch for fast searching
    await esClient.index({
      index: 'products',
      id: result.rows[0].product_id,
      body: {
        title,
        description,
        price,
        stock_quantity,
        image_url,
      },
    });

    res.status(201).json({ message: 'Product created', product: result.rows[0] });
  } catch (err) {
    console.error('Error creating product: ', err);
    res.status(500).json({ message: 'Error creating product: ' + err.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products');

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get product by ID
const getProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM Products WHERE product_id = $1', [product_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Edit product
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, stock_quantity } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Products SET title = $1, description = $2, price = $3, stock_quantity = $4 WHERE product_id = $5 RETURNING *",
      [title, description, price, stock_quantity, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(file) {
  try {
    const result = await cloudinary.uploader.upload_stream({
      folder: 'products',
    }, (error, result) => {
      if (error) {
        throw new Error('Error uploading image to Cloudinary: ' + error.message);
      }
      return result.secure_url;
    });

    return result.secure_url;
  } catch (err) {
    console.error('Error uploading image to Cloudinary: ', err);
    throw new Error('Error uploading image to Cloudinary');
  }
}

module.exports = { createProduct, getAllProducts, getProduct, editProduct };
