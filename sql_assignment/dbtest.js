var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9752);

app.get('/', function (req, res, next) {
  var context = {};
  mysql.pool.query('SELECT * FROM todo', function (err, rows, fields) {
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
  console.log(req.query.n)

  mysql.pool.query("INSERT INTO todo (`name`,`done`,`due`) VALUES (?,?,?)", [req.query.n, req.query.d, req.query.du], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home', context);
  });

});

app.get('/reset-table', function (req, res, next) {
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function (err) {
    var createString = "CREATE TABLE todo(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "done BOOLEAN," +
      "due DATE)";
    mysql.pool.query(createString, function (err) {
      context.results = "Table reset";
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
