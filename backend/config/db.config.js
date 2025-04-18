const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a pool connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'vallabh18',
  database: process.env.DB_NAME || 'platform', // Changed to match your .env default
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Log database connection parameters in non-production environments
if (process.env.NODE_ENV !== 'production') {
  console.log('Database connection config:', {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'platform',
    connectionLimit: 10
  });
}

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

module.exports = pool;
