const auth=require('../passport/auth');

module.exports = (app, passport) => {

  require('./login.js')(app, passport);
  require('./auth.js')(app, passport);
  require('./signup.js')(app, passport);
  require('./localuser.js')(app,passport);
  require('./mssql.js')(app);
  require('./api.js')(app);


  // Define the home page route
  app.get('/', function(req, res) {
    res.render('index.html', {user: req.user});
  });

  app.get('/profile', auth().authenticate(), function(req, res) {
    //here it is
   var user = req.user;
console.log(user)

   //you probably also want to pass this to your view
   res.render('profile', { title: 'profile', user: user });
    // res.render('profile.html', {
    //   user: req.user // get the user out of session and pass to template
    // });
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  // Define the about route
  app.get('/about', function(req, res) {
    res.render('about.html');
  });
  // =====================================
  // LOGOUT ==============================
  // =====================================

  //
  // /* Handle Login POST */
  // 	app.post('/login', passport.authenticate('login', {
  // 		successRedirect: '/home',
  // 		failureRedirect: '/',
  // 		failureFlash : true
  // 	}));
  //
  // 	/* GET Registration Page */
  // 	app.get('/signup', function(req, res){
  // 		res.render('register',{message: req.flash('message')});
  // 	});
  //
  // 	/* Handle Registration POST */
  // 	app.post('/signup', passport.authenticate('signup', {
  // 		successRedirect: '/home',
  // 		failureRedirect: '/signup',
  // 		failureFlash : true
  // 	}));
  //
  // 	/* GET Home Page */
  // 	app.get('/home', isAuthenticated, function(req, res){
  // 		res.render('home', { user: req.user });
  // 	});
  //
  // 	/* Handle Logout */
  // 	app.get('/signout', function(req, res) {
  // 		req.logout();
  // 		res.redirect('/');
  // 	});

  //module.exports = router;
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();

  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}
