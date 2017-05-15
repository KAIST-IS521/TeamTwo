var express = require('express');
var router = express.Router();
var q = require('./db.js');

/*
 * default home page
 */
router.get('/', function(req, res, next) {
    res.render('index');
});


/*
 * show page for registering new customer
 */
router.get('/register', function(req, res, next) {
    res.render('register');
});


/*
 * register new customer
 */
router.post('/register', function(req, res, next) {
    var id = req.param('id');
    var pw = req.param('pw');

    // SQL query for registering new user
    var qString = 'INSERT INTO users SET ?';
    var p = { user_id:id, pw:pw};

    console.log(qString);

    q.query( qString, p, function( err, result, fields ){
        if (err) {
          console.log(err);
        }
        else {
            console.log(result);
            res.redirect('/');
        }
    });

    q.execute();
});



/* login */
router.post('/login', function(req, res, next) {

    var id = req.param('id');
    var pw = req.param('pw');

    // SQL query for checking id, pw
    var qString = 'SELECT users.user_id AS id \
                  FROM users \
                  WHERE users.user_id = ? AND users.pw = ?' ;

    console.log(qString);

    q.query( qString, [ id, pw ], function( err, result, fields ){
        if (err) {
          console.log(err);
        }
        else {
            console.log(result);

            // log-in success
            if (result.length == 1 && result[0].id == id ) {
                req.session.regenerate(function(){
                    console.log(result[0].id);
                    req.session.user = result[0].id;
                    res.redirect('/product');
                });
            }
            else {
              res.redirect('/');
            }
      }
    });

    q.execute();
});


/* logout */
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(){
        res.redirect('/');
    });
});

module.exports = router;
