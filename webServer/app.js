var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

var main = require('./routes/main');
var product = require('./routes/product');
var cart = require('./routes/cart');
var order = require('./routes/order');
var mypage = require('./routes/mypage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use( session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
    // cookie: { secure: true }  // only for https
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ safeFileNames: true }));
app.use(express.static(path.join(__dirname, 'public')));

function checkAuth(req, res, next) {
    console.log( 'checkAuth' );

    if ( typeof(req.session.user) === 'undefined' ) {
      res.redirect('/');
    } else {
      next();
    }
};

app.use('/', main);
app.use('/product', checkAuth, product);
app.use('/cart', checkAuth, cart);
app.use('/order', checkAuth, order);
app.use('/mypage', checkAuth, mypage);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
