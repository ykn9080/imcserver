const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;
var MongoUser = require('../model/user');
var JsonUser = require('../data/json/imcregister.json');
const config = require('../config');
const passport = require('passport');
var opts = {
  //secret we used to sign our JWT
  secretOrKey: config.config.passport.jwtSecret,
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}
module.exports = function() {
  //exports.jwtPassport = function(passport) {
  //This verifies that the token sent by the user is valid
  passport.use('jwt', new JWTstrategy(opts, async (token, done) => {
    try {
      //Pass the user details to the next middleware
      authfind(token, done);
    } catch (error) {
      done(error);
    }
  }));
  return {
    authenticate: function() {
      return passport.authenticate("jwt", {session: false});
    }
  };
}
function authfind(token, done) {
  switch (config.passport.datasrc) {
    case "mongodb":
      MongoUser.findOne({
        _id: token._id
      }, function(err, user) {
        if (err)
          return done(err, false);
        else if (user) {
          console.log('passing thru auth!!!')
          return done(null, user);
        } else
          return done(null, false);
        }
      );
      break;
    case "json":
      var user = JsonUser.user.filter(function(usr) {
        return usr.id == token.id
      });
      if (user)
        return done(null, user);
      else {
        return done(null, false);
      }
      break;
  }
}
// module.exports.authenticate=function(passport) {
//   return passport.authenticate("jwt", {session: false});
// }
