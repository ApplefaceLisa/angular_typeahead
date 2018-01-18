var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8888;

/* mysql database */
var mysql = require('mysql');
var connection =  mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '1234',
    database: 'typeahead'
});
connection.connect(function(err) {
    if (!err)  {
        console.log("Database is connected...");
    } else {
        console.log("Error connecting database...")
    }
});

var app = express();
app.use(favicon(path.join(__dirname, 'static/image', 'favicon.ico')));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/static')));

var router = express.Router();
router.use(function(req, res, next) {
    // do logging
    console.log('Server running ' + req.url);
    next(); // make sure we go to the next routes and don't stop here
});

// get all users (accessed at GET http://localhost:8080/users)
router.get('/', function(req, res) {
    let name = req.query.name;
    let sql = "SELECT * FROM users WHERE name like '" + name + "%'";
    connection.query(sql, (err, rows, fields) => {
        if (!err)  {
            res.json(rows);
        } else {
            console.log(err);
            res.status(400).send("Failed get users...");
        }
      }
    );
});

// create user (accessed at POST http://localhost:8080/users)
router.post('/', function(req, res) {
    var sql = "INSERT INTO users SET ?";
    connection.query(sql, [req.body], (err, result) => {
        if (!err) {
            //console.log("Successed adding new user, id " + result.insertId);
            res.send("Add new user success...");
        } else {
            console.log(err);
            res.status(400).send("Failed adding new user...");
        }
    });
});

router.put('/:id', function(req, res) {
    var sql = "UPDATE users SET ? Where id = ?";
    connection.query(sql, [req.body, req.params.id], (err, result) => {
        if (err)  {
            console.log(err);
            res.status(400).send(err);
        } else {
            console.log(result);
            res.send("Updating user success...");
        }
    });
});

app.use('/users', router);

app.listen(port, function() {
    console.log('Server started on port '+ port);
});