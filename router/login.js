var User = require('../model/user.js');
var config = require('../config/');

module.exports = (app, passport) => {
  /* GET ALL PRODUCTS */
  console.log('im in login');
  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.html', {message: req.flash('loginMessage')});
  });

  app.post('/login', function(req, res, next) {
    // generate the authenticate method and pass the req/res
    passport.authenticate('login', function(err, user, info) {
      console.log(user,info);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(info); //res.redirect('/');
      }

      // req / res held in closure
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        jwt(user);
        //res.json(user);
      });
      function jwt(user) {
        const jwt = require('jsonwebtoken');
        var uuid;
        switch (config.config.passport.datasrc) {
          case "json":
            uuid = user.id;
            break;
          case "mongodb":
            uuid = user._id;
            break;
        }
        var payload = {
          // email: user.local.email,
          // password:user.local.password,
          _id: uuid
        };

        const JWTToken = jwt.sign(payload, config.config.passport.jwtSecret, {expiresIn: '2h'});
        return res.status(200).json({token: JWTToken, user: user});
      }
    })(req, res, next);
  });

}
