var express = require('express');
var router = express.Router();
var fs = require("fs");

// module for database and configuration
var q = require('./db.js');
var config = require('./config.js');

/*
 * This function shows order list.
 */
router.get('/', function(req, res, next)
{
  // query for listing all ordered items
  var qString = 'SELECT orders.order_id AS order_id, \
                        products.product_id AS product_id, \
                        products.name AS name, \
                        products.price AS price, \
                        order_items.product_num AS num, \
                        orders.status AS status, \
                        orders.added_time AS time, \
                        orders.bank_account AS bank_account \
                FROM ( orders JOIN order_items ) JOIN products \
                ON orders.order_id = order_items.order_id \
                    AND order_items.product_id = products.product_id\
                WHERE orders.user_id = ?  \
                    AND orders.status != "abort" \
                ORDER BY orders.added_time DESC';

  // query result handling logic
  q.query(qString, [req.session.user], function( err, result, fields )
  {
    if (err) {
      console.log(err);
    }
    else {
      var orders = result;
      console.log(result);

      // render order.ejs page
      res.render('order', { 'orders' : orders , 'user' : req.session.user });
    }
  });

  // query execution
  q.execute();
});


/*
 * This function query the detail information of the ordered item.
 */
router.post('/requestKey', function(req, res, next)
{
  // parameter from user
  var order_id = req.param('order_id');
  var product_id = req.param('game_id');

  // SQL query
  var qString = 'SELECT products.name AS name, \
                        products.serial_key AS serial_key \
                FROM ( orders JOIN order_items ) JOIN products \
                ON orders.order_id = order_items.order_id \
                        AND order_items.product_id = products.product_id\
                WHERE orders.user_id = ?  \
                        AND orders.order_id = ? \
                        AND orders.status = "completed" \
                        AND products.product_id= ? ';

  // query result handling
  q.query(qString, [ req.session.user, order_id, product_id,  ], function(err, result, fields)
  {
    if(err) {
      console.log(err);
      return res.json( { 'status' : 0, 'message' : "SQL error..."});
    }
    else {
      var orders = result;
      console.log(result);

      if (result.length == 1 && result[0].name == "FLAG")
      {
        // read file
        // File path and name to be edited in the final version
        fs.readFile( config.flag_path, function (err, data) {
          // file read error
          if (err)
          {
            console.error(err);
            return  res.json( { 'status' : 0, 'message' : "file error..."});
          }

          // sending text in FLAG file
          res.json( { 'status' : 1 , 'message' : data.toString() });
        });
      }
      else if ( result.length == 1 ) {
          return res.json( { 'status' : 1 , 'message' : result[0].serial_key });
      }
      else {
          return res.json( { 'status' : 0, 'message' : "You didn't buy the item yet..."});
      }
    }
  });

  // query execution
  q.execute();
});

module.exports = router;