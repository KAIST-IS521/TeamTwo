var express = require('express');
var router = express.Router();
var q = require('./db.js');

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


/*
 * list product list
 */
router.get('/search', function(req, res, next)
{
  var keyword = req.param('keyword');

  q.query('SELECT * FROM products WHERE products.name LIKE ?', [ keyword ], function( err, result, fields ){
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


/*
 * add the item to the shopping cart
 */
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