const Table = require('../model/company.js');
function dtset(req,res){
  const rtn=new Table({
    id: req.body.id || "user",
    name: req.body.name,
    language:req.body.language,
    module:req.body.module
});
return rtn;
}
function check(req,res){
  if(!req.body.name) {
      return res.status(400).send({
          message: "user can not be empty",
          body:req.body
      });return false;
  }
}
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
  const tb=dtset(req,res);

    // Save user in the database
    tb.save()
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
  Table.find()
     .then(list => {
         res.send(list);
     }).catch(err => {
         res.status(500).send({
             message: err.message || "Some error occurred while retrieving list."
         });
     });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  console.log(req.params.id,req.params)
  Table.find( { "id":req.params.id } )
  //Table.findById(req.params.id)
     .then(result => {
         if(!result) {
             return res.status(404).send({
                 message: "data not found with id " + req.params.id
             });
         }
         res.send(result);
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
     // if(!req.body.name) {
     //     return res.status(400).send({
     //         message: "user name can not be empty"
     //     });
     // }
     check();
     const dtobj={
         name: req.body.name || "Untitled",
         language: req.body.language
     }
     // Find note and update it with the request body
     Table.findByIdAndUpdate(req.params.id, dtobj, {new: true})
     .then(dt => {
         if(!dt) {
             return res.status(404).send({
                 message: "data not found with id " + req.params.id
             });
         }
         res.send(dt);
     }).catch(err => {
         if(err.kind === 'ObjectId') {
             return res.status(404).send({
                 message: "data not found with id " + req.params.id
             });
         }
         return res.status(500).send({
             message: "Error updating data with id " + req.params.id
         });
     });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  Table.findByIdAndRemove(req.params.id)
      .then(dt => {
          if(!dt) {
              return res.status(404).send({
                  message: "data not found with id " + req.params.id
              });
          }
          res.send({message: "data deleted successfully!"});
      }).catch(err => {
          if(err.kind === 'ObjectId' || err.name === 'NotFound') {
              return res.status(404).send({
                  message: "data not found with id " + req.params.id
              });
          }
          return res.status(500).send({
              message: "Could not delete data with id " + req.params.id
          });
      });
};
