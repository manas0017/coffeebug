const pool = require('../db');  // Import the MySQL connection pool

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming the user role is stored in req.user (e.g., after JWT auth)

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  next(); // If the user is an admin, allow them to proceed
};

// Create a new product (Admin only)
const createProduct = (req, res) => {
  const {
    productName,
    productPrice,
    productDescription,
    productCategoryID,
    productAvailability,
    productQuantity
  } = req.body;
  const image = req.file ? req.file.filename : null;  // Get the image filename from multer

  // Validate required fields
  if (!productName || productPrice === undefined || !productCategoryID) {
    return res.status(400).json({ message: 'Product name, price, and category are required.' });
  }

  // Validate that price is not negative
  if (productPrice < 0) {
    return res.status(400).json({ message: 'Price cannot be negative.' });
  }

  pool.query(
    'INSERT INTO products (ProductName, ProductPrice, ProductDescription, ProductCategoryID, Image, ProductAvailability, ProductQuantity) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [productName, productPrice, productDescription, productCategoryID, image, productAvailability, productQuantity], 
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }

      res.status(201).json({
        message: 'Product created successfully',
        productId: results.insertId
      });
    }
  );
};

// Get all products with category name
const getAllProducts = (req, res) => {
  pool.query(
    `SELECT p.*, c.ProductCategoryName 
     FROM products p
     JOIN Productcategories c ON p.ProductCategoryID = c.CategoryID`, 
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      res.json(results); // Send all products along with category names
    }
  );
};

// Get product by ID with category name
const getProductById = (req, res) => {
  const { id } = req.params;

  pool.query(
    `SELECT p.*, c.CategoryName 
     FROM products p
     JOIN categories c ON p.ProductCategoryID = c.CategoryID
     WHERE p.ProductID = ?`, 
    [id], 
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(results[0]);
    }
  );
};

// Get categories
const getCategories = (req, res) => {
  pool.query(
    'SELECT ProductCategoryID, ProductCategoryName FROM ProductCategories',
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      res.json(results);
    }
  );
};


// Update product (Admin only)
const updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    productName,
    productPrice,
    productDescription,
    productCategoryID,
    productAvailability,
    productQuantity
  } = req.body;
  const image = req.file ? req.file.filename : null;  // Get the new image if provided

  // Validate required fields
  if (!productName || productPrice === undefined || !productCategoryID) {
    return res.status(400).json({ message: 'Product name, price, and category are required.' });
  }

  // Validate that price is not negative
  if (productPrice < 0) {
    return res.status(400).json({ message: 'Price cannot be negative.' });
  }

  let updateQuery = `UPDATE products SET ProductName = ?, ProductPrice = ?, ProductDescription = ?, ProductCategoryID = ?, ProductAvailability = ?, ProductQuantity = ?`;
  let updateValues = [productName, productPrice, productDescription, productCategoryID, productAvailability, productQuantity];

  // Add image to the update query if provided
  if (image) {
    updateQuery += `, Image = ?`;
    updateValues.push(image);
  }

  updateQuery += ` WHERE ProductID = ?`;
  updateValues.push(id);

  pool.query(updateQuery, updateValues, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  });
};

// Delete product (Admin only)
const deleteProduct = (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM products WHERE ProductID = ?', [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  isAdmin,
  getCategories
};
