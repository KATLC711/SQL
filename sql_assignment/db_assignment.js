var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });


app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3636);


app.get('/', function (req, res, next) {
  var context = {};
  mysql.pool.query('SELECT * FROM exercise', function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    console.log(rows)
    query_result = []
    for (i = 0; i < rows.length; i++) {
      query_result.push({ 'id': rows[i].id, 'name': rows[i].name, 'reps': rows[i].reps, 'weight': rows[i].weight, 'date': getFormattedDate(rows[i].date), 'unit': rows[i].unit })
    }
    context.results = query_result;
    res.render('home', context);
  });
});


//insert?name=kevin&reps=10&weight=20&date=2019-01-01&unit=kg
app.get('/insert', function (req, res, next) {
  var context = {};
  mysql.pool.query("INSERT INTO exercise (`name`,`reps`,`weight`,`date`,`unit`) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.unit], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    context.status_msg = "Inserted id " + result.insertId;
    res.redirect('/');
  });
});

app.get('/delete', function (req, res, next) {
  var context = {};
  mysql.pool.query("DELETE FROM exercise WHERE id=?", [req.query.id], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/');
  });
});



app.get('/reset-table', function (req, res, next) {
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS exercise", function (err) {
    var createString = "CREATE TABLE exercise(" +
      "id INT PRIMARY KEY AUTO_INCREMENT," +
      "name VARCHAR(255) NOT NULL," +
      "reps INT," +
      "weight INT," +
      "date DATE," +
      "unit VARCHAR(5))";
    mysql.pool.query(createString, function (err) {
      context.status_msg = "Table reset";
      res.render('home', context);
    })
  });
});



app.get('/edit-form', function (req, res, next) {
  var context = {};
  context.id = req.query.id
  context.name = req.query.name
  context.reps = req.query.reps
  context.weight = req.query.weight
  context.date = getFormattedDateYMR(req.query.date)
  context.unit = req.query.unit
  //console.log(getFormattedDate(req.query.date))
  res.render('edit-form', context);
});


///safe-update?id=1&name=The+Task&done=false
app.get('/edit', function (req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM exercise WHERE id=?", [req.query.id], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    if (result.length == 1) {
      var curVals = result[0];
      mysql.pool.query("UPDATE exercise SET name=?,reps=?,weight=?,date=?,unit=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.unit || curVals.unit, req.query.id],
        function (err, result) {
          if (err) {
            next(err);
            return;
          }
          res.redirect('/');
        });
    }
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










function getFormattedDate(date_unformmated) {

  var date = new Date(date_unformmated)

  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  final = month + '-' + day + '-' + year;

  return final.toString();
}




function getFormattedDateYMR(date_unformmated) {

  var date = new Date(date_unformmated)

  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  final = year + '-' + month + '-' + day;

  return final.toString();
}