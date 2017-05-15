var express = require('express');
var router = express.Router();
var q = require('./db.js');


/*
 * show all items in the shopping cart
 */
router.get('/', function(req, res, next) {

	var qString = 'SELECT products.name AS name, products.price AS price, shopping_cart.product_num AS num  \
            	FROM ( users JOIN shopping_cart ) JOIN products \
               	ON users.user_id = shopping_cart.user_id \
                	AND shopping_cart.product_id = products.product_id\
                WHERE users.user_id = ?  \
                ORDER BY shopping_cart.added_time ASC';

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


/*
 * purchase all items in the shopping cart
 */
router.get('/purchase', function(req, res, next)
{
	var iString = 'INSERT INTO orders ( user_id, product_id, product_num ) \
				SELECT users.user_id AS user_id, products.product_id AS product_id, shopping_cart.product_num AS product_num \
				FROM ( users JOIN shopping_cart ) JOIN products \
               	ON users.user_id = shopping_cart.user_id \
                	AND shopping_cart.product_id = products.product_id\
                WHERE users.user_id = ? ';

	var dString = 'DELETE shopping_cart  \
            	FROM ( users JOIN shopping_cart ) JOIN products \
               	ON users.user_id = shopping_cart.user_id \
                	AND shopping_cart.product_id = products.product_id\
                WHERE users.user_id = ? ';

    // bank connection needed


    // deleting current items in shopping cart
	q.query( iString, [ req.session.user ], function( err, result, fields ){
		if (err) {
			console.log(err);
		}
		else {
			var items = result;
			console.log(result);

			q.query( dString, [ req.session.user ], function( err, result, fields ){
				if (err) {
					console.log(err);
				}
				else {
					var items = result;
					console.log(result);

					// show empty list in shopping cart
					res.redirect('/order');
				}
			});
		}
	});

	q.execute();
});


module.exports = router;