var express = require('express');
var router = express.Router();

// module for database
var q = require('./db.js');
var fs = require("fs");


/* list orders */
router.get('/', function(req, res, next)
{
  var qString = 'SELECT orders.order_id AS order_id, products.product_id AS product_id, products.name AS name, products.price AS price, order_items.product_num AS num, orders.status AS status, orders.added_time AS time, orders.bank_account AS bank_account \
                FROM ( orders JOIN order_items ) JOIN products \
                ON orders.order_id = order_items.order_id \
                    AND order_items.product_id = products.product_id\
                WHERE orders.user_id = ?  \
                ORDER BY orders.added_time DESC';
  q.query(qString, [req.session.user], function( err, result, fields )
  {
    if (err)
    {
      console.log(err);
    }
    else
    {
      var orders = result;
      console.log(result);
      // client.end();

      res.render('orders', { 'orders' : orders , 'user' : req.session.user });
    }
  });

  q.execute();

  //updateUserBankID(2);
});

function getUserBankID()
{
    // bank connected needed
    return "dummy_bank_id";
}

function updateUserBankID(order_id)
{
  var userBankID = getUserBankID();

  q.query('UPDATE orders SET bank_id = ? WHERE order_id = ?', [userBankID, order_id], function( err, result, fields )
  {
    if (err) {
      console.log(err);
    }
    else {
      console.log('bank_id update successful');
    }
  });

  q.execute();
}

router.get('/requestFlag', function(req, res, next)
{
  var qString = 'SELECT orders.order_id AS order_id, products.product_id AS product_id, products.name AS name, products.price AS price, order_items.product_num AS num, orders.status AS status, orders.added_time AS time, orders.bank_account AS bank_account \
                FROM ( orders JOIN order_items ) JOIN products \
                  ON orders.order_id = order_items.order_id \
                    AND order_items.product_id = products.product_id\
                  WHERE orders.user_id = ?  AND orders.status = "completed" AND products.name = "FLAG"';

  q.query(qString, [req.session.user], function(err, result, fields)
  {
    if(err) {
      console.log(err);
      return res.json( { 'status' : 0, 'message' : "SQL error..."});
    }
    else {
      var orders = result;
      console.log(result);

      if (result.length >= 1)
      {
        // read encrypted file
        // File path and name to be edited in the final version
        fs.readFile( './' + 'tmp' + '.asc', function (err, data)
        {
          // file read error
          if (err)
          {
            console.error(err);
            return  res.json( { 'status' : 0, 'message' : "file error..."});
          }
          console.log("Asynchronous read: " + data.toString());
          // sending encrypted file
          res.json( { 'status' : 1 , 'message' : data.toString() });
        });
      }
      else {
          return res.json( { 'status' : 0, 'message' : "You didn't buy FLAG item yet..."});
      }
    }
  });

  q.execute();
});

module.exports = router;