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
 * show all items in the shopping cart 
 */
router.get('/', function(req, res, next) {

	var qString = 'SELECT products.name AS name, products.price AS price, shopping_cart.product_num AS num  \
            	FROM ( users JOIN shopping_cart ) JOIN products \
               	ON users.user_id = shopping_cart.user_id \
                	AND shopping_cart.product_id = products.product_id\
                WHERE users.user_id = ? ' ;

	q.query( qString, [ req.session.user ], function( err, result, fields ){
		if (err) {
			console.log(err); 
		}
		else {
			var items = result; 
			console.log(result);
			// client.end(); 

			res.render('cart', { 'items' : items , 'user' : req.session.user }); 
		}
	}); 

	q.execute();

});

module.exports = router;