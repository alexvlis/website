/*
* node.js back-end server for Alex Vlissidis
*/

/* System includes */
var express = require('express');
var cfenv = require("cfenv");
var bodyParser = require('body-parser')
var auth = require('./public/js/auth.js');
var nano = require('nano')(auth.url);
var Cloudant = require('@cloudant/cloudant');

var cloudant = Cloudant({account:auth.username, password:auth.password});
var jsonParser = bodyParser.json();

/* Definition of constants */
/* HTTP status codes */
const NOT_FOUND = 404;
const OK = 200;
const BAD = 400;

/* Database names */
const DB = "database";

/* Definition of global variables */
var hit_counter = 0;
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Express Setup */
app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
	/* Modify the headers */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  /* Pass to next layer of middleware */
  next();
});

/******************************************************************************
************************** REST API Implementation ****************************
******************************************************************************/

/*
* GET callbacks
*/

/* Serve home page */
app.get('/test', function (req, res) {
  console.error("Hi");
  var db = cloudant.db.use(DB);
  db.get('hit_counter', function(err, data) {
    if (!err) {
      hit_counter = data;
      hit_counter++;

      var db = cloudant.db.use(DB);
      db.insert({'hit_counter': hit_counter}, 'hit_counter', function(err, body, headers) {
        if (err) {
          console.warn(err);
          res.send(err);
        } else {
          res.sendFile();
        }
      });
    } else {
      res.send(err);
    }
  });
});

app.get('/bio', function (req, res) {
  res.sendFile(__dirname + "/public/bio.html");
});

app.get('/projects', function (req, res) {
  res.sendFile(__dirname + "/public/projects.html");
});

app.get('/publications', function (req, res) {
  res.sendFile(__dirname + "/public/publications.html");
});

app.get('/hits', function (req, res) {
  var db = cloudant.db.use(DB);
  db.get('hit_counter', function(err, data) {
    if (!err) {
      req.json(data);
    }
  });

  res.json(hit_counter)
});

/******************************************************************************
************************************ MAIN *************************************
******************************************************************************/

var port = process.env.PORT || 8000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
