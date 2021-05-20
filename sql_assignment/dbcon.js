var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'mysql.eecs.oregonstate.edu',
  user            : 'cheungke',
  password        : '4019',
  database        : 'cheungke'
});

module.exports.pool = pool;
