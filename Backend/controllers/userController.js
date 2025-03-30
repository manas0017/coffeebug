const pool = require('../db');  // MySQL connection pool import garne jo SQL database sanga interact garna kaam aauxa
const bcrypt = require('bcryptjs');  // Password hash garna ko lagi bcrypt use garne
const { request } = require('express');
const jwt = require('jsonwebtoken');  // JSON Web Token (JWT) sign ani verify garne

// Middleware to check if the user is authenticated (JWT)
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token', error: err });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming the user role is stored in req.user (after JWT auth)

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  next(); // If the user is an admin, allow them to proceed
};

// Get all users
const getAllUsers = (req, res) => {
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }
    res.json(results); // Send the users as a JSON response
  });
};

// Update a user (only accessible to admin)
const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, gender, profilePicture, phoneNumber, role, address, dateOfBirth } = req.body;

  // Check if any required fields are missing
  if (!firstName || !lastName || !email || !gender || !role) {
    return res.status(400).json({ message: 'FirstName, LastName, Email, Gender, and Role are required' });
  }

  // Update user details in the database
  pool.query(
    'UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Gender = ?, ProfilePicture = ?, PhoneNumber = ?, Role = ?, Address = ?, DateOfBirth = ? WHERE UserId = ?',
    [firstName, lastName, email, gender, profilePicture, phoneNumber, role, address, dateOfBirth, id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    }
  );
};

// Monday 
// Update a user's own information (self-update)
const updateOwnUser = (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters
  const { firstName, lastName, email, gender, profilePicture, phoneNumber, address, dateOfBirth } = req.body;

  // Ensure that the user is updating their own account
  if (req.user.userId !== parseInt(id)) {
    return res.status(403).json({ message: 'You can only update your own details' });
  }

  // Check if any required fields are missing
  if (!firstName || !lastName || !email || !gender) {
    return res.status(400).json({ message: 'FirstName, LastName, Email, and Gender are required' });
  }

  // Update the user's details in the database
  pool.query(
    'UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Gender = ?, ProfilePicture = ?, PhoneNumber = ?, Address = ?, DateOfBirth = ? WHERE UserId = ?',
    [firstName, lastName, email, gender, profilePicture, phoneNumber, address, dateOfBirth, id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Your details have been updated successfully' });
    }
  );
};

const updateUserStatus = (req, res) => {
  console.log(userId)
  console.log("Route hit: /updateUserStatus/" + req.params.id);
console.log("Request body:", req.body);

  const { id } = req.params;
  const { action } = req.body; // 'deactivate' or 'softDelete'
  const userId = parseInt(id, 10);

  if (!['deactivate', 'softDelete'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action. Use "deactivate" or "softDelete"' });
  }

  pool.query('SELECT Status, isDeleted FROM users WHERE UserId = ?', [userId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Current user data:", rows[0]);

    if (action === 'softDelete') {
      if (rows[0].isDeleted === 1) {
        return res.json({ message: 'User is already soft deleted' });
      }
      

      pool.query('UPDATE users SET isDeleted = 1 WHERE UserId = ?', [userId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        console.log("Soft delete result:", results);
        res.json({ message: 'User soft deleted successfully' });
      });
    } else if (action === 'deactivate') {
      console.log("User role:", req.user);
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Permission denied. Admin access required.' });
      }

      if (rows[0].Status === 'inactive') {
        return res.json({ message: 'User is already inactive' });
      }
      console.log(userId)
      pool.query('UPDATE users SET Status = ? WHERE UserId = ?', ['inactive', userId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }
        res.json({ message: 'User has been deactivated successfully' });
      });
    }
  });
};


const restoreUser = (req, res) => {
  const { id } = req.params;
  pool.query('UPDATE users SET isDeleted = 0 WHERE UserId = ?', [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User restored successfully' });
  });
};



// Create a new user (register)
const createUser = (req, res) => {
    const { 
      firstName, 
      lastName, 
      email, 
      gender, 
      profilePicture, 
      phoneNumber, 
      role, 
      password, 
      address, 
      dateOfBirth 
    } = req.body;
  
    // Check if the required fields are present
    if (!firstName || !lastName || !email || !gender || !role || !password) {
      return res.status(400).json({ message: 'FirstName, LastName, Email, Gender, Role, and Password are required' });
    }
  
    // Hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Password hashing error:', err);
        return res.status(500).send('Error hashing password');
      }

      // Insert user into the database with hashed password
      pool.query(
        'INSERT INTO users (FirstName, LastName, Email, Gender, ProfilePicture, PhoneNumber, Role, Password, Address, DateOfBirth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [firstName, lastName, email, gender, profilePicture, phoneNumber, role, hashedPassword, address, dateOfBirth], 
        (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
          }
          res.status(201).json({
            message: 'User created successfully',
            userId: results.insertId,
          });
        }
      );
    });
};

// Get a single user by ID
const getUserById = (req, res) => {
    const { id } = req.params;
  
    pool.query('SELECT * FROM users WHERE UserId = ?', [id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(results[0]);
    });
};
const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  pool.query('SELECT * FROM users WHERE Email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    bcrypt.compare(password, user.Password, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).json({ message: 'Error comparing password' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: user.UserId, email: user.Email, role: user.Role },
        process.env.JWT_SECRET || 'supersecretkey12345',
        { expiresIn: '1h' }
      );

      console.log("Token generated:", token); // Debugging
      return res.json({
        message: 'Login successful! Welcome back.',
        token,
        userId: user.UserId  // ✅ Returning UserId
      });
    });
  });
};




const logoutUser = (req, res) => {
  console.log(req.session)
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.json({ message: "Logged out successfully" });
  });
};


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  loginUser,
  logoutUser,
  authenticateToken, 
  isAdmin,           
  restoreUser,
  updateUserStatus
  

};
