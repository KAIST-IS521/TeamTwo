// basic module for web app
var express = require('express');
var router = express.Router();

// module for database
var q = require('./db.js');

/*
 * This shows all items in the shopping cart.
 */
router.get('/', function(req, res, next)
{
	// SQL query for showing items in the shopping cart
	var qString = 'SELECT products.product_id AS product_id, products.name AS name, products.price AS price, shopping_cart.product_num AS num, shopping_cart.cart_id AS cart_id \
            	FROM ( users JOIN shopping_cart ) JOIN products \
               	ON users.user_id = shopping_cart.user_id \
                	AND shopping_cart.product_id = products.product_id\
                WHERE users.user_id = ?  \
                ORDER BY shopping_cart.added_time ASC';

    // SQL query handling
	q.query( qString, [ req.session.user ], function( err, result, fields ){
		// when SQL error
		if (err) {
			console.log(err);
		}
		// when SQL success
		else {
			var items = result;
			console.log(result);

			// show cart.ejs
			res.render('cart', { 'items' : items , 'user' : req.session.user });
		}
	});

    // SQL execution
	q.execute();
});



/*
 * add the item to the shopping cart
 */
router.post('/remove', function(req, res, next)
{
    // parameter from client
    var id = req.param('cart_id');

    // SQL query for adding
    var dString = 'DELETE shopping_cart  \
            	FROM shopping_cart \
                WHERE shopping_cart.cart_id = ? ';

    console.log(dString);

    // add the item to the shopping cart table
    q.query( dString, [ id ], function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
            return res.json( { status: 0, message: "Wrong parameter..."} );
        }
        // when SQL success
        else {
            console.log(result);
            res.json( { status: 1, message: 'Deleted from shopping cart...' } );
        }
    });

    // execute SQL
    q.execute();
});



/*
 * This function purchases all items in the shopping cart.
 */
router.get('/purchase', function(req, res, next)
{
	var order_id = req.session.user + new Date().toISOString().replace(/T/,'').replace(/\..+/,'').replace( " ", "" )
										.replace( "-", "" ).replace( "-", "" ).replace( ":", "" ).replace( ":", "" );

	console.log( order_id );

	// SQL query for inserting items to the order_item table
	var order_iString = 'INSERT INTO orders SET ? ';

	// SQL query for inserting items to the order_items table
	var items_iString = 'INSERT INTO order_items ( order_id, product_id, product_num ) \
				SELECT "' + order_id + '", shopping_cart.product_id AS product_id, shopping_cart.product_num AS product_num \
				FROM shopping_cart \
                WHERE shopping_cart.user_id = ? ';

	// SQL query for deleting items from the shopping cart
	var dString = 'DELETE shopping_cart  \
            	FROM shopping_cart \
                WHERE shopping_cart.user_id = ? ';

    // bank connection needed

    var bank_account = 'temp_account1';
	var p = { order_id: order_id, user_id: req.session.user, bank_account: bank_account, status: 'pending' };

    // inserting to the orders table
	q.query( order_iString, p, function( err, result, fields ){
		// when SQL error
		if (err) {
			console.log(err);
			return res.json( { status: 0, message: "DB error while inserting to orders..."} );
		}
		// when SQL success
		else
		{
		    // inserting items to the order_items table
			q.query( items_iString, [ req.session.user ], function( err, result, fields ){
				// when SQL error
				if (err) {
					console.log(err);
					return res.json( { status: 0, message: "DB error while inserting to order_items..."} );
				}
				// when SQL success
				else {
					var items = result;
					console.log(result);

					// deleting current items from the shopping cart
					q.query( dString, [ req.session.user ], function( err, result, fields ){
						// when SQL error
						if (err) {
							console.log(err);
							return res.json( { status: 0, message: "DB error while deleting..."} );
						}
						// when SQL success
						else {
							var items = result;
							console.log(result);

							// show empty list in shopping cart
							res.json({ status: 1 , account: bank_account });
						}
					});

					q.execute();
				}
			}); // end order_items SQL

			q.execute();
		}
	}); // end orders SQL

	// SQL execute
	q.execute();
});


module.exports = router;