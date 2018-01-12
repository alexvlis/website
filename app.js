/*
* node.js back-end server for Alex Vlissidis
*/

/* System includes */
var express = require('express');
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

/* Definition of constants */
/* HTTP status codes */
const NOT_FOUND = 404;
const OK = 200;
const BAD = 400;

/* Definition of global variables */
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
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
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

/******************************************************************************
************************************ MAIN *************************************
******************************************************************************/

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
