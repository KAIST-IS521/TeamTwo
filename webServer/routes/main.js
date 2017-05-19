var express = require('express');
var router = express.Router();
var cp = require('child_process');
var fs = require("fs");

var q = require('./db.js');
var config = require('./config.js');

/*
 * This function shows the default main web page.
 * It check the session info.
 */
router.get('/', function(req, res, next)
{
    if ( typeof(req.session) === 'undefined' ) {
        res.render('main');
    }
    else {
        res.render('main', { 'user' : req.session.user });
    }
});


/*
 * This function just shows the web page for registering new customer.
 */
router.get('/register', function(req, res, next)
{
    res.render('register');
});


/*
 * This function generates the random number for user verification.
 * The generated random number is encrypted with the private key
 * which is matched with the Github id, and it is sent to the client.
 */
router.post('/requestPGP', function(req, res, next)
{
    var id = req.param('github-id');

    // SQL query for registering new user
    var qString = 'SELECT github_id AS id , email \
                  FROM github_users \
                  WHERE github_id = ? ';

    console.log(qString + ':' + id );

    // processing logic after SQL query is executed
    q.query( qString, [id], function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
            return res.json( { status: 0, message: "Wrong parameter..."} );
        }
        // when SQL success
        else {
            console.log(result);

            // when github id is exist
            if (result.length == 1 && result[0].id == id ) {
                console.log(result[0].id);

                // random number for verifying user
                var random_num = Math.floor(Math.random() * (config.MAX - config.MIN));

                // file write
                fs.writeFile( './tmp/' + result[0].id + '.txt', random_num.toString(),  function(err) {
                    // file error
                    if (err) {
                        console.error(err);
                        return res.json( { status: 0, message: "file error..."} );
                    }

                    console.log( result[0].id + ".txt: Data written successfully!" );

                    // GPG excution.
                    cp.exec('gpg --armor --encrypt --yes --recipient '
                                + result[0].email + ' ./tmp/' + result[0].id + '.txt ;'
                                // + 'cp ./tmp/' + result[0].id + '.txt.asc ./public/' + result[0].id + '.asc'
                                , function(error, stdout, stderr)
                    {
                        // GPG error
                        if (error) {
                            console.error(err);
                            return  res.json( { status: 0, message: "GPG error..."} );
                        }

                        // read encrypted file
                        fs.readFile( './tmp/' + result[0].id + '.txt.asc', function (err, data) {
                            // file read error
                            if (err) {
                                console.error(err);
                                return  res.json( { status: 0, message: "file error..."} );
                            }

                            console.log("Asynchronous read: " + data.toString());

                            // sending encrypted file
                            res.json( {
                                status: 1,
                                encrypt: data.toString(),
                                url: req.protocol + '://' + req.host + '/' + result[0].id + '.asc'
                            });
                        }); // end file read
                    }); // end GPG execution
                }); // end file write
            } // end github id checking

            // when github id is not exist
            else {
                return res.json( { status: 0, message: "wrong github id..."} );
            }
        } // end SQL success
    }); // end SQL query

    // execute SQL query
    q.execute();
});

/*
 * This function registers new customer.
 * It checks validity Github ID, decrypts the encrypted data,
 * compares the decrypted data with the original value,
 * and inserts new user id, pw, Github_id to the database.
 */
router.post('/register', function(req, res, next)
{
    // parameter from the client
    var id = req.param('id');
    var pw = req.param('pw');
    var pw2 = req.param('pw2');
    var github_id = req.param('github-id');
    var enc_data = req.param('enc-data');

    // check whether two passwords are same or not
    if ( pw != pw2 ) {
        return res.json( { status: 0, message: "Two password are differnt"} );
    }

    // SQL query for registering new user
    var qString = 'SELECT github_id, email \
                  FROM github_users \
                  WHERE github_id = ? ';

    console.log(qString + ':' + github_id );

    // processing logic after SQL query is executed
    q.query( qString, [github_id], function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
            return res.json( { status: 0, message: "Wrong parameter..."} );
        }
        // when SQL success
        else {
            console.log(result);

            // when the github id is not existing
            if (result.length != 1 || result[0].github_id != github_id ) {
                return res.json( { status: 0, message: "Not existing github id..."} );
            }
            // when the github id is correct
            else {
                console.log( result[0].github_id );

                // enc_data formatting
                console.log( enc_data );

                // save encrypted data as a file
                fs.writeFile( './tmp/' + result[0].github_id + '_client.asc', enc_data, function(err, data) {
                    if (err) {
                        console.error(err);
                        return res.json( { status: 0, message:'Encrypted data was not saved...' });
                    }

                    console.log( result[0].github_id + "_client.asc: saved!" );

                    // GPG excution.
                    cp.exec('gpg --passphrase ' + config.PASSWORD
                                + ' --decrypt ./tmp/' + result[0].github_id + '_client.asc '
                                + ' > ./tmp/' + result[0].github_id + '_client.txt', function(error, stdout, stderr)
                    {
                        // when GPG error
                        if (error) {
                            console.error( error );
                            return res.json( { status: 0, message:'GPG has some problem...' });
                        }

                        // read decrypted file
                        fs.readFile( './tmp/' + result[0].github_id + '_client.txt', function (err, data) {
                            // when file read error
                            if (err) {
                                console.error(err);
                                return  res.json( { status: 0, message:'File system has some problem...' });
                            }

                            var decrypt_num = data.toString();
                            console.log("decrypted number: " + decrypt_num );

                            // read original file
                            fs.readFile( './tmp/' + result[0].github_id + '.txt', function (err, data) {
                                // when file read error
                                if (err) {
                                    console.error(err);
                                    return  res.json( { status: 0, message:'Original file has some problem...' });
                                }

                                var origin_num = data.toString();
                                console.log("original number: " + origin_num );

                                // check whether the user verified number is same with the origin random number
                                if ( parseInt( origin_num ) == parseInt( decrypt_num ) ) {

                                    // SQL query for registering new user
                                    var rString = 'INSERT INTO users SET ?';
                                    var p = { user_id:id, pw:pw, github_id: github_id };

                                    console.log(rString);

                                    // Insert new user into database
                                    q.query( rString, p, function( err, result, fields ){
                                        // when SQL error
                                        if (err) {
                                            return res.json( { status: 0, message: "Try again with another ID" } );
                                        }
                                        // when SQL success
                                        else {
                                            console.log(result);
                                            return res.json( { status: 1, message: "Success for registering new user" } );
                                        }
                                    });

                                    // execute SQL query
                                    q.execute();
                                }
                                else {
                                    return res.json( { status: 0, message: "Authentication failed..."} );
                                }
                            });
                        });
                    });
                }); // end file save
            } // end correct github_id
        } // end success query
    }); // end query

    // execute SQL query
    q.execute();
});



/*
 * This function checks the user and password for login.
 */
router.post('/login', function(req, res, next)
{
    // parameter from the client
    var id = req.param('id');
    var pw = req.param('pw');

    // SQL query for checking id, pw
    var qString = 'SELECT users.user_id AS id \
                  FROM users \
                  WHERE users.user_id = ? AND users.pw = ?' ;

    console.log(qString);

    // processing logic after SQL query
    q.query( qString, [ id, pw ], function( err, result, fields ){
        // when SQL error
        if (err) {
            console.log(err);
            return res.redirect('/');
        }

        // when SQL success
        else {
            console.log(result);

            // log-in success
            if (result.length == 1 && result[0].id == id ) {

                // make session
                req.session.regenerate(function(){
                    console.log(result[0].id);
                    req.session.user = result[0].id;
                    res.redirect('/');
                });
            }

            // log-in fail
            else {
                res.redirect('/');
            }
        }
    });

    // execute SQL query
    q.execute();
});


/*
 * This function removes session for logout
 */
router.get('/logout', function(req, res, next)
{
    // remove session and redirect to the home
    req.session.destroy(function(){
        res.redirect('/');
    });
});

module.exports = router;
