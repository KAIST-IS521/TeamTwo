var express = require('express');
var router = express.Router();
var q = require('./db.js');


/* list ordersre */
router.get('/', function(req, res, next) {
  q.query('SELECT * FROM orders', function( err, result, fields ){
    if (err) {
      console.log(err);
    }
    else {
      var orders = result;
      console.log(result);
      // client.end();

      res.render('order', { 'products' : orders , 'user' : req.session.user });
    }
  });

  q.execute();
});

/*
 * list order list
 */
router.get('/search', function(req, res, next)
{
    var keyword = req.param('keyword');

    q.query('SELECT * FROM orders WHERE orders.order_id LIKE ?', [ keyword ], function( err, result, fields ){
        if (err) {
            console.log(err);
        }
        else {
            var orders = result;
            console.log(result);
            // client.end();

            res.render('orders', { 'orders' : orders , 'user' : req.session.user });
        }
    });

    q.execute();

});

/*
TODO: make the add function
*/

module.exports = router;