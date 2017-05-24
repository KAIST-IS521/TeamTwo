// basic module for web app
var express = require('express');
var router = express.Router();
var cp = require('child_process');

// module for database, configuration and bank
var config = require('./config.js');
var q = require('./db.js');
var bank = require('./bank.js');


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
        res.json( { status: 0, message: 'Not valid input...' } );
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

    // input check
    if ( product_num < 1 || 8 < product_num ) {
        res.json( { status: 0, message: 'Not valid input...' } );
        return;
    }

    // order_id
    var order_id = req.session.user + (new Date()).getTime().toString();
    console.log( order_id );

    var bank_account;
    var bank_pw;

    // SQL statement
    var order_iString = 'INSERT INTO orders SET ? ';
    var item_iString = 'INSERT INTO order_items SET ? ';


    // make_account.py excution.
    cp.exec( config.make_account, function(error, stdout, stderr)
    {
        // GPG error
        if (error) {
            console.error(error);
            return  res.json( { status: 0, message: "Bank account error..."} );
        }

        console.log(stdout);

        // parsing account and password from the stdout
        bank_account = stdout.toString().substring(0,13);
        bank_pw = stdout.toString().substring(14,27);

        console.log( bank_account + ' ' + bank_pw );

        // data for inserting to DB
        var order_p = { order_id: order_id, user_id: req.session.user, bank_account: bank_account, bank_pw: bank_pw, status: 'pending' };
        var item_p = { order_id: order_id, product_id: product_id, product_num: product_num };

        // inserting current items in order_item table
        q.query( order_iString, order_p, function( err, result, fields ){
            // when SQL error
            if (err) {
                console.log(err);
                return res.json( { status: 0, message: "DB error while inserting data to orders..."} );
            }

            // when SQL success
            // inserting current items in order_item table
            q.query( item_iString, item_p, function( err, result, fields )
            {
                // when SQL error
                if (err) {
                    console.log(err);
                    return res.json( { status: 0, message: "DB error while inserting data to order_items..."} );
                }

                // when SQL success
                var items = result;
                console.log(result);

                // check bank account after 1 minute
                bank.checkAccount();

                // show empty list in shopping cart
                res.json({ status: 1 , message: "Success...", account: bank_account });
            });

            // execute SQL
            q.execute();
        });

        // execute SQL
        q.execute();
    }); // end exec
});

module.exports = router;
