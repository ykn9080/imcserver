// app/models/user.js
// load the things we need

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


// //Set up default mongoose connection
 const config = require('../config');
// //var mongoDB='mongodb://yknam:ykn9080@ds135399.mlab.com:35399/imcdb';
// mongoose.connect(config.currentsetting.datasrc,{ useNewUrlParser: true });
// // Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;
// //Get the default connection



const conn = mongoose.createConnection(
    config.currentsetting.datasrc,{ useNewUrlParser: true }
);



var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




// define the schema for our user model
var userSchema = mongoose.Schema({
  // email        : String,
  // password: String

    // id: req.body.id,
    //             password: createHash(password),
    //               name:req.body.username,
    //               comp:req.body.comp,
    //               group:req.body.group,
    //               email:req.body.email

                  
id:String,
password:String,
  email: String,
  name: String,
  group: String,
  comp: String
  // local: {
  //   id: String,
  //   password: String,
  //   email: String,
  //   name: String,
  //   group: String,
  //   comp: String
  // },
  // facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // },
  // twitter: {
  //   id: String,
  //   token: String,
  //   displayName: String,
  //   username: String
  // },
  // google: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

// create the model for users and expose it to our app
module.exports = conn.model('User', userSchema);
