var User = require('../model/user.js');

module.exports = (app, passport) => {
  app.post('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(req.user);
    }
);

  app.post('/auth', function(req, res, next) {
    // generate the authenticate method and pass the req/res
    passport.authenticate('jwt', function(err, user, info) {
      console.log('user:',user,info)
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({msg:'wrong user'});//res.redirect('/');
      }

      // // req / res held in closure
      // req.logIn(user, function(err) {
      //   if (err) {
      //     return next(err);
      //   }
      //   jwt(user);
      //   //res.json(user);
      // });
      // function jwt(user) {
      //   const jwt = require('jsonwebtoken');
      //   const payload = {
      //     // email: user.local.email,
      //     // password:user.local.password,
      //     _id: user._id
      //   };
      //   const JWTToken = jwt.sign(payload, 'secret', {expiresIn: '2h'});
      //   return res.status(200).json({ token: JWTToken, user:user});
      // }
    })(req, res, next);
  });

}
