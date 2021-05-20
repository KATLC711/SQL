var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs290_cheungke',
  password: '4019',
  database: 'cs290_cheungke'
});

module.exports.pool = pool;
