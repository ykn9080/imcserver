var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const localuserSchema = new Schema({
  name: String,
  pass: String
});

module.exports=mongoose.model('localuser',localuserSchema)
