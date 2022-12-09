const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'photo_db',
  password: '4790'
});

module.exports = db.promise();