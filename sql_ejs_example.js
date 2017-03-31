var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require("body-parser");
var async = require("async");

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));

// use res.render to load up an ejs view file
var connection = mysql.createConnection({
    host: '206.12.96.242',
    user: 'group5',
    password: 'untanglingGroup5',
    database: 'group5DB'
});
connection.connect();

var employees;

connection.query('SELECT * FROM coupons where category = ""', function(err, rows, fields) {
    if (err) throw err;

    employees = rows;
    console.log(rows[0]);
});

connection.end();

app.get('/', function(req, res) {


    res.render('look', { employees: employees })
})

//query
app.post('/query', function(req, res) {

    //console.log(req.body);
    async.series([function(callback) {
            var connection = mysql.createConnection({
                host: '206.12.96.242',
                user: 'group5',
                password: 'untanglingGroup5',
                database: 'group5DB'
            });
            connection.connect();
            var q = 'SELECT * FROM coupons where category LIKE "' + req.body.queryStr + '"';
            //console.log(q);
            connection.query(q, function(err, rows, fields) {
                if (err) throw err;

                employees = rows;
                //console.log(rows[0]);
                connection.end();
                callback(null, "query done");
            });


        }, function(callback) {
            res.redirect("/");
            callback(null, "display done");
        }


    ], function(err, results) {
        //console.log(results);
        //could do some error processing here
    });



});

// welcome page
app.get('/welcome', function(req, res) {
    res.render('welcome');
});

// stores page
app.get('/stores', function(req, res) {
    res.render('stores');
});

// query page
app.get('/look', function(req, res) {
    res.render('look', { employees: employees })
});

// contact page
app.get('/contact', function(req, res) {
    res.render('contact');
});

// log on page
app.get('/logon', function(req, res) {
    res.render('logon');
});

app.listen(8005, function() {
    console.log('Example app listening on port 8005!')
})