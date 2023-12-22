// MySQL pool
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "servicex",
  port: "3306",
});

module.exports = pool;
