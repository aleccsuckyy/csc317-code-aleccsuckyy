var express = require('express');
var router = express.Router();
const UserModel = require('../../models/User');
const db = require('../../config/db');
var bcrypt = require('bcrypt')
const {registerValidation, loginValidation} =require('../../middleware/regValidation');
const {successPrint, errorPrint} = require('../../helpers/debug/debugprinters');
const {UserError} = require('../../helpers/error/UserError')

// insert user into db
// /api/users
router.post('/', registerValidation, (req,res, next) => {
  let {username, email, password} = req.body;

  UserModel.usernameExists(username)
  .then((usernameDoesExist) => {
    if (usernameDoesExist){
      throw new UserError('Registration Failed: username already exists', 'registration', 200);
    } else {
      UserModel.emailExists(email);
    }
  })
  .then((emailDoesExists) => {
    if(emailDoesExists){
      throw new UserError('Registration Failed: email already exists', 'registration', 200);
    } else {
      return UserModel.create(username,password,email);
    }
  })
  .then((createdUserId) => {
    if(createdUserId < 0){
      throw new UserError('Server Error, user could not be created', 'registration', 500);
    } else {
      req.flash('success', 'User account has been created')
      res.redirect('/login');
    }
  })
  .catch((err) => {
    errorPrint('user could not be made', err);
    next(err);
  })

})



// login for user
// /api/users/login
router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  console.log(username);
  console.log(password);

  let baseSQL = "SELECT id, username, password FROM Users WHERE username=?;"
  let userId;

  // grab username 
  db.execute(baseSQL, [username])
    .then(([results]) => {
      // if there is an array length 1 meaning username was found
      if (results && results.length == 1) {
        // grab the password from the array
        let hashedPassword = results[0].password;
        // set userID
        userId = results[0].id;
        // compare password input with hashed password
        return bcrypt.compare(password, hashedPassword);
      } else {
        throw new errorPrint("Invalid username and or password!", "/login", 500)
      }
    })
    .then((passwordsMatch) => {
      // if they match then log user in
      if (passwordsMatch) {
        console.log(`User ${username} is logged in`);
        req.session.username = username;
        req.session.userId = userId;
        res.locals.logged = true;
        req.flash('success', 'You are logged in now')
        res.json("success")
      } else {
        req.flash('error', err.getMessage());
        throw new errorPrint("passwords did not match", '/login', 600)
      }
    })
    .catch((err) => {
      console.log(err);
    })

});




// logout 
router.post('/logout', (req,res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("session could not be destroyed")
    } else {
      console.log("user is logged out ")
      res.clearCookie("csid");
      res.json({status: "OK", message: " user is logged out "});
    }
  })
})

module.exports = router;
