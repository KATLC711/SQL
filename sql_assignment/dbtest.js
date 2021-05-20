var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9752);


app.get('/', function (req, res, next) {
  var context = {};
  mysql.pool.query('SELECT * FROM exercise', function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});



app.get('/insert', function (req, res, next) {
  var context = {};
  mysql.pool.query("INSERT INTO todo (`name`,`reps`,`weight`,`date`,`unit`) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.unit], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    context.status_msg = "Inserted id " + result.insertId;
    res.render('home', context);
  });
});



app.get('/reset-table', function (req, res, next) {
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS exercise", function (err) {
    var createString = "CREATE TABLE exercise(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "reps INT NOT NULL" +
      "weight INT NOT NULL" +
      "date DATE" +
      "unit VARCHAR(5))";
    mysql.pool.query(createString, function (err) {
      context.status_msg = "Table reset";
      res.render('home', context);
    })
  });
});



app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
