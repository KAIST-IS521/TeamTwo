var express = require('express');
var router = express.Router();
var q = require('./db.js');
var cp = require('child_process');
var fs = require("fs");

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
 * generate random number and encrypt with user id
 */
router.post('/generate', function(req, res, next) {
    var id = req.param('github-id');

    // SQL query for registering new user
    var qString = 'SELECT github_id AS id , email \
                  FROM github_users \
                  WHERE github_id = ? ';
    var MAX = 650000;
    var MIN = 0;

    console.log(qString + ':' + id );

    q.query( qString, [id], function( err, result, fields ){
        if (err) {
          return console.log(err);
        }
        else {
            console.log(result);

            // check the github id is existing
            if (result.length == 1 && result[0].id == id ) {
                console.log(result[0].id);

                var random_num = Math.floor(Math.random() * (MAX - MIN));

                // file write
                fs.writeFile( './tmp/' + result[0].id + '.txt', random_num.toString(),  function(err) {
                    if (err) {
                        return console.error(err);
                    }

                    console.log( result[0].id + ".txt: Data written successfully!" );

                    // GPG excution.
                    cp.exec('gpg --armor --encrypt --yes --recipient '
                                + result[0].email + ' ./tmp/' + result[0].id + '.txt '
                                , function(error, stdout, stderr)
                    {
                        if (error) {
                            return console.error( error );
                        }

                        // read encrypted file
                        fs.readFile( './tmp/' + result[0].id + '.txt.asc', function (err, data) {
                            if (err) {
                                return console.error(err);
                            }

                            // sending encrypted file
                            console.log("Asynchronous read: " + data.toString());
                            res.json( { status: 1, encrypt: data.toString() } );
                        });
                    });
                });
            }
            else {
                res.json( { status: 0, message: "wrong github id..."} );
            }
        }
    });

    q.execute();
});


/*
 * upload user file
 */
router.post('/upload', function(req, res) {
    if (!req.files)
        return res.json( { status: 0, message:'File not uploaded...' });

    var github_id = req.param('github-id');

    // SQL query for checking github_id
    var qString = 'SELECT github_id, email \
                  FROM github_users \
                  WHERE github_id = ? ';

    console.log(qString + ':' + github_id );

    q.query( qString, [github_id], function( err, result, fields ){
        if (err) {
          return console.log(err);
        }
        else {
            // moving encrypted tile
            console.log( req.files.encFile.name );

            req.files.encFile.mv('./tmp/' + github_id + '_client.asc', function(err) {
                if (err)
                  return res.json( { status: 0, message:'Uploaded file is not saved in the server...' });

                res.json( { status: 1, message:'File uploaded...' });
            });
        }
    });
});


/*
 * register new customer
 */
router.post('/register', function(req, res, next) {
    var id = req.param('id');
    var pw = req.param('pw');
    var github_id = req.param('github-id');

    // SQL query for registering new user
    var qString = 'SELECT github_id, email \
                  FROM github_users \
                  WHERE github_id = ? ';

    console.log(qString + ':' + github_id );

    q.query( qString, [github_id], function( err, result, fields ){
        if (err) {
          return console.log(err);
        }
        else {
            console.log(result);

            // check the github id is existing
            if (result.length == 1 && result[0].github_id == github_id ) {
                console.log( result[0].github_id );

                // check whether uploaded file is exist
                fs.readFile( './tmp/' + result[0].github_id + '_client.asc', function(err, data) {
                    if (err) {
                        console.error(err);
                        return res.json( { status: 1, message:'First, upload encrpyted file...' });
                    }

                    console.log( result[0].github_id + "_client.asc: checked!" );

                    // GPG excution.
                    cp.exec('gpg --passphrase ' + config.PASSWORD
                                + ' --decrypt ./tmp/' + result[0].github_id + '_client.asc '
                                + ' > ./tmp/' + result[0].github_id + '_client.txt', function(error, stdout, stderr)
                    {
                        if (error) {
                            return console.error( error );
                        }

                        // read decrypted file
                        fs.readFile( './tmp/' + result[0].github_id + '_client.txt', function (err, data) {
                            if (err) {
                                return console.error(err);
                            }

                            var decrypt_num = data.toString();
                            console.log("decrypted number: " + decrypt_num );

                            // read original file
                            fs.readFile( './tmp/' + result[0].github_id + '.txt', function (err, data) {
                                if (err) {
                                    return console.error(err);
                                }

                                var origin_num = data.toString();
                                console.log("original number: " + origin_num );

                                if ( parseInt( origin_num ) == parseInt( decrypt_num ) ) {

                                    // SQL query for registering new user
                                    var rString = 'INSERT INTO users SET ?';
                                    var p = { user_id:id, pw:pw, github_id: github_id };

                                    console.log(rString);

                                    q.query( rString, p, function( err, result, fields ){
                                        if (err) {
                                          console.log(err);
                                        }
                                        else {
                                            console.log(result);
                                            res.json( { status: 1, message: "success..." } );
                                            // res.redirect('/');
                                        }
                                    });

                                    q.execute();
                                }
                                else
                                    res.json( { status: 0, message: "wrong number..."} );
                            });
                        });
                    });
                });
            }
            else {
                res.json( { status: 0, message: "wrong github id..."} );
            }
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
