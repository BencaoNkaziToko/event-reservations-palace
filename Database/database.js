// Database/database.js
import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbeventos",
});

export default connection;
