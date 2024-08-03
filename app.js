var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var fileUpload = require('express-fileupload');

var dashboardRouter = require('./routes/dashboard');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var unitsRouter = require('./routes/units');
var goodsRouter = require('./routes/goods');
var suppliersRouter = require('./routes/suppliers');
var purchasesRouter = require('./routes/purchases');
var purchaseitemsRouter = require('./routes/purchaseitems');
var salesRouter = require('./routes/sales');
var saleitemsRouter = require('./routes/saleitems');
var customersRouter = require('./routes/customers');
const { isLoggedIn } = require('./helpers/util');

var app = express();
app.use(flash());
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'ayamgoreng',
  resave: false,
  saveUninitialized: true
}))

app.use('/', indexRouter);
app.use('/dashboard', isLoggedIn, dashboardRouter);
app.use('/users', isLoggedIn, usersRouter);
app.use('/units', isLoggedIn, unitsRouter);
app.use('/goods', isLoggedIn, goodsRouter);
app.use('/suppliers', isLoggedIn, suppliersRouter);
app.use('/purchases', isLoggedIn, purchasesRouter);
app.use('/purchaseitems', isLoggedIn, purchaseitemsRouter);
app.use('/customers', isLoggedIn, customersRouter);
app.use('/sales', isLoggedIn, salesRouter);
app.use('/saleitems', isLoggedIn, saleitemsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
