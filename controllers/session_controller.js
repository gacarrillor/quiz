// MW de autorización de accesos a páginas restringidas
exports.loginRequired = function(req, res, next){
  if (req.session.user){ next(); }
  else {res.redirect('/login');}
};

// GET /login
exports.new = function(req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('sessions/new', {errors:errors});
};

// POST /login
exports.create = function(req, res){
  var login = req.body.login;
  var password = req.body.password;
  
  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user){
    if (error){
      req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
      res.redirect('/login');
      return;
    }
    
    // Crear req.session.user y guardar campos id y username
    // La sesión se define por la existencia de: req.session.user
    req.session.user = {id: user.id, username: user.username};
    
    res.redirect(req.session.redir.toString()); // Redireccionar a path anterior
  });
};

// DELETE /logout
exports.destroy = function(req, res){
  delete req.session.user;
  delete req.session.time; // We want "time" also to be deleted and not to cause problems when relogin
  res.redirect(req.session.redir.toString());
};

