const mysql = require("mysql2");
const CONFIG = require("./config/db");

const pool = mysql.createPool({
  connectionLimit: 10,
  ...CONFIG,
});

module.exports = pool;
