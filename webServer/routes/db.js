// node-mysql
var mysql = require('mysql');

// DataBase Config
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

module.exports = q;