var login = require('./login');
var signup = require('./signup');
var auth = require('./auth');
var Login = require('../model/user');
var config=require('../config/');
// // Configuring Passport


module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        var uuid;
        switch(config.basic.passport.datasrc){
          case 'mongodb':
            uuid=user._id;
          break;
          case 'json':
            uuid=user.id;
          break;
        }
        done(null, uuid);
    });

    passport.deserializeUser(function(id, done) {
      console.log('deser!!!!!!!!!!!!!!',id)
        Login.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
    auth();

}
