import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',    // your DB host
  user: 'root',         // your DB user
  password: 'password', // your DB password
  database: 'your_db',  // your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
