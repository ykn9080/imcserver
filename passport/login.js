var LocalStrategy = require('passport-local').Strategy;

var User = require('../model/user');
var JsonUser = require('../data/json/imcregister.json');
var bCrypt = require('bcrypt-nodejs');
const config = require('../config/');
const username_field=config.basic.passport.username;
const password_field=config.basic.passport.password;
// load up the users json data
//  var User  ={'email':'youngkinam@kebi.com','password':'good'}
module.exports = function(passport) {
console.log('in passport')
  passport.use('login', new LocalStrategy({
    // local 전략을 세움
    usernameField:username_field,
    passwordField: password_field,
    //session: true, // 세션에 저장 여부
    passReqToCallback: true
  }, function(req, username, password, done) {
    // check in mongo if a user with username exists or not
    console.log('chk login',req.body,username,password,config.basic.passport.datasrc)
    switch (config.basic.passport.datasrc) {
      case "mongodb":
        User.findOne({
          'id': username
        }, function(err, user) {
          // In case of any error, return using the done method
          if (err)
            return done(err);

          // Username does not exist, log the error and redirect back
          if (!user) {
            console.log('User Not Found with id ' + username);
            return done(null, false, {'message': 'User Not found.'});
          }
          //User exists but wrong password, log the error
          if (!isValidPassword(user, password)) {
            console.log('Invalid Password');
            return done(null, false, {'message': 'Invalid Password'}); // redirect back to login page
          }
          // User and password both match, return user from done method
          // which will be treated like success
          console.log(user, password);
          return done(null, user, user);
        });
        break;
        case "json":

        var user = JsonUser.user.filter(function(usr) {
            console.log(usr.email,username)
          return usr.id == username
        });
        if (user[0])
          return done(null,user[0], user[0]);
        else {
          return done(null, false, req.flash('message', 'User Not found.'));
        }
        break;
    }
  }));

  var isValidPassword = function(user, password) {
    //return ((password==user.password) ? true:false);
    //return bCrypt.compareSync(password, user.local.password);
    console.log(password,user.password)
    return bCrypt.compareSync(password, user.password);
  }
}
