var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  // Guardar path en session.redir para retornar luego del logout
  if (!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();  
});

app.use(function(req, res, next){
  // Guardar hora de la última interacción dentro de la sesión
  if (req.session.user) { // Only for sessions
    if (!req.session.time){ // First access?
      req.session.time = new Date().getTime();
    } else { // We have a session.time already
      if (new Date() - req.session.time >= 120000){ // Destroy session
        delete req.session.user;
        delete req.session.time;
        res.redirect(req.session.redir.toString());
        return;
      } else {
        req.session.time = new Date().getTime(); // Renew session time
      }
    }
  }
  next();
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
