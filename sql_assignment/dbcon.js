var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mysql.eecs.oregonstate.edu',
  user: 'cs290_cheungke',
  password: '4019',
  database: 'cs290_cheungke'
});

module.exports.pool = pool;
