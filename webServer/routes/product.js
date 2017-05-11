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



/* 
 * list product list 
 */
router.get('/', function(req, res, next) {

  q.query('SELECT * FROM products', function( err, result, fields ){
    if (err) {
      console.log(err); 
    }
    else {
      var products = result; 
      console.log(result);
      // client.end(); 

      res.render('product', { 'products' : products , 'user' : req.session.user }); 
    }
  }); 

  q.execute();

});


router.get('/add', function(req, res, next) {

	var id = req.param('id');
	var num = req.param('num');

    // SQL query for adding 
    var qString = 'INSERT INTO shopping_cart SET ?'; 
    var p = { user_id: req.session.user, product_id:id, product_num: 1}; 

    console.log(qString); 

    q.query( qString, p, function( err, result, fields ){
        if (err) {
          console.log(err); 
        }
        else {
            console.log(result);
            res.json( { message: 'Added to shopping cart...' } );   
        }
    }); 

    q.execute();

});



module.exports = router;