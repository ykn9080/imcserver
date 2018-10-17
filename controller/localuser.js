const User = require('../model/localuser.js');

// Create and Save a new user
exports.create = (req, res) => {

  // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "user can not be empty",
            body:req.body
        });
    }

    // Create a user
    const user = new User({
        name: req.body.name || "user",
        pass: req.body.pass
    });

    // Save user in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  console.log('ssss')
  User.find()
     .then(user => {
         res.send(user);
     }).catch(err => {
         res.status(500).send({
             message: err.message || "Some error occurred while retrieving user."
         });
     });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.id)
     .then(user => {
         if(!user) {
             return res.status(404).send({
                 message: "user not found with id " + req.params.id
             });
         }
         res.send(user);
     }).catch(err => {
         if(err.kind === 'ObjectId') {
             return res.status(404).send({
                 message: "user not found with id " + req.params.id
             });
         }
         return res.status(500).send({
             message: "Error retrieving user with id " + req.params.id
         });
     });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
     if(!req.body.name) {
         return res.status(400).send({
             message: "user name can not be empty"
         });
     }

     // Find note and update it with the request body
     User.findByIdAndUpdate(req.params.id, {
         name: req.body.name || "Untitled User",
         pass: req.body.password
     }, {new: true})
     .then(user => {
         if(!user) {
             return res.status(404).send({
                 message: "user not found with id " + req.params.id
             });
         }
         res.send(user);
     }).catch(err => {
         if(err.kind === 'ObjectId') {
             return res.status(404).send({
                 message: "user not found with id " + req.params.userid
             });
         }
         return res.status(500).send({
             message: "Error updating user with id " + req.params.userid
         });
     });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.id)
      .then(user => {
          if(!user) {
              return res.status(404).send({
                  message: "user not found with id " + req.params.id
              });
          }
          res.send({message: "user deleted successfully!"});
      }).catch(err => {
          if(err.kind === 'ObjectId' || err.name === 'NotFound') {
              return res.status(404).send({
                  message: "user not found with id " + req.params.id
              });
          }
          return res.status(500).send({
              message: "Could not delete user with id " + req.params.id
          });
      });
};

exports.readdata=(req,res)=>{
  try{
  var path=req.body.path,
  dataname=req.body.dataname,
  keycode=req.body.keycode,
  keyvalue=req.body.keyvalue;
  var dt=require('..'+path);
  console.log(dataname);
  if(dataname)
  dt=dt[dataname];
  if(keycode){
    var dtt = dt.filter(function(usr) {
        return usr[keycode] == keyvalue;
    });
    if(dtt.length==1) dt=dtt[0];
    else dt=dtt;
  }
  res.send(dt);
}
catch(err){
  res.send({"error": err});
}
};
