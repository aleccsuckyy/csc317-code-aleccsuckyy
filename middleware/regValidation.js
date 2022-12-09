// username
const checkUsername = (username) => {
  /*
   ^    --> start of the string
   \D   --> anything NOT a digit [^0-9]
   \w   --> anything that is alphanumeric character [a-zA-Z0-9]
   {2,} --> 2 or more characters with no upper limits
  */
  let usernameChecker = /^\D\w{2,}$/;
  return usernameChecker.test(username);
}



// password 
const checkPassword = (password) => {
  // make sure password is valid
  let valid =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return valid.test(password)
}


// email 
const checkEmail = (email) => {
  // make input an array
  let emailArray = email.split('');
  // check to see if @ is in input
  let valid = emailArray.includes("@") 

  // if not valid 
  if (!valid){
    return false
  } else {
   return true
  }
}

// confirm password
const checkConfirmPassword = (password, confirmPassword) => {
  if (confirmPassword != password){
    console.log("passwords do not match")
    return false;
  } else {
    console.log("passwords match");
    return true;
  }
}



// validate all of it
const registerValidation = (req, res ,next) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let passwordConfirm = req.body.passwordConfirm;

  // check username
  if (!checkUsername(username)) {
    console.log("username was not okay");
    // send error message
    req.flash('error', 'invalid username!');
    // save our session before redirect
    req.session.save(err => {
      res.redirect('registration');
    })
  } 
  // check password
  else if (!checkPassword(password)){
    console.log("password was not okay");
    // send error message
    req.flash('error', 'invalid password!');
    // save our session before redirect
    req.session.save(err => {
      res.redirect('registration');
    })
  } else if (!checkEmail(email)){
    console.log("email was not okay");
    // send error message
    req.flash('error', 'invalid email!');
    // save our session before redirect
    req.session.save(err => {
      res.redirect('registration');
    })
  }  
  // else if (!checkConfirmPassword(password, passwordConfirm)){
  //   console.log("passwords did not match ");
  //   // send error message
  //   req.flash('error', 'invalid passwords!');
  //   // save our session before redirect
  //   req.session.save(err => {
  //     res.redirect('registration');
  //   })
  // } 
  else {
    console.log("registration was perfect")
    next();
  }


}

const loginValidation = (req, res ,next) => {
  
}


module.exports = {registerValidation, loginValidation}
