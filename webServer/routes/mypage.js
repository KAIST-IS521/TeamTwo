// basic module for web app
var express = require('express');
var router = express.Router();

// module for database
var q = require('./db.js');

/*
 * This function lists message list in mypage.
 */
router.get('/', function(req, res, next)
{
    // SQL query for listing messages
    q.query('SELECT * FROM messages', function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
        }
        // when SQL success
        else {
            var messages = result;
            console.log(result);

            // show mypage.ejs
            res.render('mypage', { 'messages' : messages , 'user' : req.session.user });
        }
    });

    // SQL execute
    q.execute();
});


/*
 * This function is to send message to mypage.
 */
router.post('/sendMessage', function(req, res, next)
{
    // parameter from client
    var msg = req.param('msg');

    // SQL statement
    var iString = 'INSERT INTO messages SET ? ';
    var p = { user_id: req.session.user, msg: msg };

    // inserting messages to mypage
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

            // send success message
            res.json({ status: 1 , message: 'Sent message...'});
        }
    });

    // execute SQL
    q.execute();
});


module.exports = router;