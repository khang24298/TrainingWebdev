var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var configPassport = require('./config/passport');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var setupRouter = require('./routes/setup');

/** Database require */
let connectDB = require("./database/connect");
// let createSchema = require("./database/schema/Todo");

connectDB.connect();
// createSchema.Todos;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:"application.secret",
    name: "todolistapplication",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false /*Use 'true' without setting up HTTPS will result in redirect errors*/
    }
  })
);

app.use(passport.initialize()); 
app.use(passport.session());
configPassport(passport);

app.use('/auth', loginRouter);
app.use('/setup', setupRouter);

/** Require login */
app.use((req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  } else {
    return res.redirect('/auth/login');
  }
});

/** App router */
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
