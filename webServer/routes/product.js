// basic module for web app
var express = require('express');
var express = require('express');
var router = express.Router();

// module for database
var q = require('./db.js');

/*
 * This function list product items.
 */
router.get('/', function(req, res, next)
{
    // SQL for listing
    q.query('SELECT * FROM products', function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
        }
        // when SQL success
        else {
            var products = result;
            console.log(result);

            // show product.ejs
            res.render('product', { 'products' : products , 'user' : req.session.user });
        }
    });

    // execute SQL
    q.execute();
});


/*
 * add the item to the shopping cart
 */
router.get('/add', function(req, res, next)
{
    // parameter from client
    var id = req.param('product-id');
    var num = req.param('product-num');

    // input check
    if ( num < 1 || 8 < num ) {
        res.json( { message: 'Not valid input...' } );
        return;
    }

    // SQL query for adding
    var qString = 'INSERT INTO shopping_cart SET ?';
    var p = { user_id: req.session.user, product_id: id, product_num: num };

    console.log(qString);

    // add the item to the shopping cart table
    q.query( qString, p, function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
            return res.json( { status: 0, message: "Wrong parameter..."} );
        }
        // when SQL success
        else {
            console.log(result);
            res.json( { status: 1, message: 'Added to shopping cart...' } );
        }
    });

    // execute SQL
    q.execute();
});



/*
 * This function is to purchase just one items from the detail item page.
 */
router.get('/purchase', function(req, res, next)
{
    // parameter from client
    var product_id = req.param('product-id');
    var product_num = req.param('product-num');
    var price;

    // get the price
    var t = require('./db.js');
        // SQL query for registering new user
    var qString = 'SELECT price FROM products WHERE product_id = ?';
    t.query(qString, [product_id], function (err, result, fields)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            price = result[0].price;
            console.log('product\'s price: ' + price);
        }
    });
    t.execute();
    //alert(typeof price);
    //console.log(String(Number(price) * Number(product_num)));

    // SQL statement
    var iString = 'INSERT INTO orders SET ? ';
    var p = { user_id: req.session.user, product_id: product_id, product_num: product_num, status: 'pending' };

    console.log( iString + ", " + req.session.user +  ", " + product_id + ", " + product_num + ", pending");

    // bank connection needed


    // inserting current items in shopping cart
    q.query( iString, p, function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
            return res.json( { status: 0, message: "Wrong parameter..."} );
        }
        // when SQL success
        else {
            var items = result;
            console.log(result);

            // show empty list in shopping cart
            res.json({ status: 1 , message: "Success...", account: 'temp_account2'});
        }
    });

    // execute SQL
    q.execute();
});


module.exports = router;