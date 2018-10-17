
var User = require('../model/user.js');

module.exports = (app,passport) => {
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.html', { message: req.flash('signupMessage') });
	});
	// // process the signup form
	app.post('/signup', passport.authenticate('signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : 'true' // allow flash messages
	}));

  // /* SAVE PRODUCT */
  // app.post('/signup', function(req, res, next) {
  //   // Validate request
  //     if(!req.body.email) {
  //         return res.status(400).send({
  //             message: "user can not be empty"
  //         });
  //     }
	//
  //     // // Create a user
  //     // const user = new User();
	// 		//
  //     // user.email= req.body.email;// || "user",
  //     // user.password= req.body.password;
	// 		//
  //     // User.findOne({email: req.body.email, function (err, post) {
  //     //    if (err) return next(err);
  //     //    res.json(post);
  //     //  }});
  //     // // Save user in the database
  //     // user.save()
  //     // .then(data => {
  //     //     res.send(data);
  //     // }).catch(err => {
  //     //     res.status(500).send({
  //     //         message: err.message || "Some error occurred while creating the user."
  //     //     });
  //     // });
	//
	//
  //   // User.create(req.body, function (err, post) {
  //   //   if (err) return next(err);
  //   //   res.json(post);
  //   // });
  // });

// /* UPDATE PRODUCT */
// router.put('/user/:email', function(req, res, next) {
//   User.findByIdAndUpdate(req.params.username, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });
//
// /* DELETE PRODUCT */
// router.delete('/user/:username', function(req, res, next) {
//   User.findByIdAndRemove(req.params.username, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

}
