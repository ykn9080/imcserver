var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');
var Company = require('../model/company');
var bCrypt = require('bcrypt-nodejs');
var config=require('../config/');
var jsonUser=require('../data/json/imcregister.json');
const username_field=config.basic.passport.username;
const password_field=config.basic.passport.password;
module.exports = function(passport) {

  passport.use('signup', new LocalStrategy({
    // local 전략을 세움
    usernameField:username_field,
    passwordField: password_field,
    session: false, // 세션에 저장 여부
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, function(req, username, password, done) {
    console.log(req.body)
    switch (config.basic.passport.datasrc) {
      case "mongodb":

        findOrCreateUser = function() {
          // find a user in Mongo with provided username
          User.findOne({
            username_field: username
          }, function(err, user) {
            // In case of any error, return using the done method
            if (err) {
              console.log('Error in SignUp: ' + err);
              return done(err);
            }
            // already exists
            if (user) {
              console.log('User already exists with id: ' + username);
              //return done(null, false, req.flash('message', 'User Already Exists'));
              return done(null, false, {message: 'User Already Exists'});
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User({
                // local: {
                //   id: username,
                //   password: createHash(password),
                //   name:req.body.name,
                //   comp:req.body.comp,
                //   group:req.body.group,
                //   email:req.body.email
                // }
                id: username,
                password: createHash(password),
                  name:req.body.name,
                  comp:req.body.comp,
                  group:req.body.group,
                  email:req.body.email

              });

              // set the user's local credentials
              //newUser.push({local: {email: username, password: createHash(password)}});

              // save the user
              newUser.save(function(err) {
                if (err) {
                  console.log('Error in Saving user: ' + err);
                  throw err;
                }
                console.log('User Registration succesful',newUser);
                //return done(null, newUser);
              });
            }
          });
        };
        break;
      case 'json':
        var user = JsonUser.user.filter(function(usr) {
            console.log(usr.email,username)
          return usr.email == username
        });
        if (user[0])
          return done(null,user[0], user[0]);
        else {
          return done(null, false, req.flash('message', 'User Not found.'));
        }
        break;
    }
    // Delay the execution of findOrCreateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));

  // Generates hash using bCrypt
  var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

}
