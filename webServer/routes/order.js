var express = require('express');
var router = express.Router();

// DataBase Config 
// node-mysql
var mysql = require('mysql');
var client = mysql.createConnection({ 
  host : 'localhost',
  database : 'shoppingmalldb',
  user: 'root',
  password : 'is521'
});
  
// running queries as normal...
client.query('USE shoppingmalldb');

// mysql-queues
var queues = require('mysql-queues');
const DEBUG = true;
queues(client, DEBUG);
var q = client.createQueue();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Sorry... Not integrated yet with Bank system...');
});

module.exports = router;