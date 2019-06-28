// Applies to some routes and not others. Use this in certain places. 

module.exports = function(req, res, next) {
    if (!req.user) {
      req.flash('error', 'You must be logged in to access that page');
      res.redirect('/auth/login');
    } else {
      next();
    }
  };

  