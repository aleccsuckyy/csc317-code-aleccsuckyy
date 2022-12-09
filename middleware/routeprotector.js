const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');

const routerProtectors = {};


routerProtectors.userIsLoggedIn = function(req,res, next) {
  if (req.session.username) {
    successPrint("User is logged in");
    next();
  } else {
    errorPrint("user is not logged in");
    req.flash('error', 'you must be logged in to create a Post')
    res.redirect('/login');
  }
}





module.exports = routerProtectors;