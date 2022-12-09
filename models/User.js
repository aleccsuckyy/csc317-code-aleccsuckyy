const db = require('../config/db');
const UserModel = {};
var bcrypt = require('bcrypt')

// create user
UserModel.create = (username,password,email) => {
  return bcrypt.hash(password, 15)
    .then((hashedPassword) => {
      let baseSQL = 'INSERT INTO Users (username, email, password, createdAt) VALUE (?,?,?,now())';
      return db.execute(baseSQL, [username, email, hashedPassword])
    })
    .then(([results]) => {
      if(results&& results.affectedRows){
        return Promise.resolve(results.insertId);
      } else {
        return Promise.resolve(-1);
      }
    })
    .catch((err) => Promise.reject(err)) 
}

// see if user exists
UserModel.usernameExists = (username) => {
  return db.execute("SELECT * FROM Users WHERE username=?", [username])
    .then(([results]) => {
      return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

// see if user email exists
UserModel.emailExists = (email) => {
  return db.execute("SELECT * FROM Users WHERE email=?", [email])
  .then(([results]) => {
    return Promise.resolve(!(results && results.length == 0));
  })
  .catch((err) => Promise.reject(err));
}


module.exports = UserModel;