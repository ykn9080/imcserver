const jwt = require('jsonwebtoken');
var User = require('../model/user');
const PassportLocalStrategy = require('passport-local').Strategy;

const config = require('../config');

 module.exports = function(passport){


   passport.serializeUser(function(user, done) {
       done(null, user.id);
   });

   passport.deserializeUser(function(id, done) {
       done({ id: id, nickname: "test"})
   });


       passport.use('login', new PassportLocalStrategy(//{new LocalStrategy(
         function(username, password, done) {
           console.log("test");
             if (username === 'username') {
                 return done(null, { name: "test", id: '1234'});
             } else {
                 return done(null, false, { message: 'Incorrect cred.' });
             }
         })
       )


//  	passport.use('login', new PassportLocalStrategy({
//       // local 전략을 세움
//      usernameField: 'email',
//      passwordField: 'password',
//
//   session: true,
//   passReqToCallback: true
// }, (req, email, password, done) => {
//   const userData = {
//     email: email.trim(),
//     password: password.trim()
//   };
//   // find a user by email address
//   return User.findOne({ email: userData.email }, (err, user) => {
//     if (err) { return done(err); }
//
//     if (!user) {
//       const error = new Error('Incorrect email or password');
//       error.name = 'IncorrectCredentialsError';
//
//       return done(error);
//     }
//
//     // check if a hashed user's password is equal to a value saved in the database
//     return user.comparePassword(userData.password, (passwordErr, isMatch) => {
//       if (err) { return done(err); }` `
//
//       if (!isMatch) {
//         const error = new Error('Incorrect email or password');
//         error.name = 'IncorrectCredentialsError';
//
//         return done(error);
//       }
//
//       const payload = {
//         sub: user._id
//       };
//
//       // create a token string
//       const token = jwt.sign(payload, config.jwtSecret);
//       const data = {
//         name: user.name
//       };
//
//       return done(null, token, data);
//     });
//    });
// })
//)
}
