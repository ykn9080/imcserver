var LocalStrategy = require('passport-local').Strategy;

var User = require('../model/user');
var JsonUser = require('../data/json/imcregister.json');
var bCrypt = require('bcrypt-nodejs');
const config = require('../config/');

// load up the users json data
//  var User  ={'email':'youngkinam@kebi.com','password':'good'}
module.exports = function(passport) {

  passport.use('login', new LocalStrategy({
    // local 전략을 세움
    usernameField:'id',
    passwordField: 'password',
    //session: true, // 세션에 저장 여부
    passReqToCallback: true
  }, function(req, username, password, done) {
    // check in mongo if a user with username exists or not
    console.log(req.body,username,password)
    switch (config.config.passport.datasrc) {
      case "mongodb":
        User.findOne({
          'local.id': username
        }, function(err, user) {
          // In case of any error, return using the done method
          if (err)
            return done(err);

          // Username does not exist, log the error and redirect back
          if (!user) {
            console.log('User Not Found with email ' + username);
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
    return bCrypt.compareSync(password, user.local.password);
  }

  //
  // passport.use('signup', new LocalStrategy({
  //    local 전략을 세움
  //   usernameField: 'email',
  //   passwordField: 'password',
  //   session: true,  세션에 저장 여부
  //   passReqToCallback: true  allows us to pass back the entire request to the callback
  // }, function(req, username, password, done) {
  //
  //   findOrCreateUser = function() {
  //      find a user in Mongo with provided username
  //     User.findOne({
  //       'local.email': username
  //     }, function(err, user) {
  //        In case of any error, return using the done method
  //       if (err) {
  //         console.log('Error in SignUp: ' + err);
  //         return done(err);
  //       }
  //        already exists
  //       if (user) {
  //         console.log('User already exists with email: ' + username);
  //         return done(null, false, req.flash('message', 'User Already Exists'));
  //       } else {
  //          if there is no user with that email
  //          create the user
  //         var newUser = new User({
  //           local: {email: username, password: createHash(password)}
  //           comp:req.body.comp
  //
  //         });
  //
  //          set the user's local credentials
  //         newUser.push({local: {email: username, password: createHash(password)}});
  //
  //          save the user
  //         newUser.save(function(err) {
  //           if (err) {
  //             console.log('Error in Saving user: ' + err);
  //             throw err;
  //           }
  //           console.log('User Registration succesful');
  //           return done(null, newUser);
  //         });
  //       }
  //     });
  //   };
  //    Delay the execution of findOrCreateUser and execute the method
  //    in the next tick of the event loop
  //   process.nextTick(findOrCreateUser);
  // }));

  // passport.use('jwt',new JWTstrategy(opts, async (token, done) => {
  //   try {
  //     Pass the user details to the next middleware
  //     console.log('token:',token)
  //     User.findOne({
  //       _id: token._id
  //     }, function(err, user) {
  //       if (err){
  //
  //         return done(err, false);
  //       }
  //       else if (user) {
  //         console.log(user);
  //         return done(null, user);
  //       } else{
  //           console.log('false!!!');
  //         return done(null, false);
  //       }
  //
  //       }
  //     );
  //   } catch (error) {
  //     done(error);
  //   }
  // }));

}
