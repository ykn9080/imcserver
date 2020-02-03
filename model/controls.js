var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const controlSchema = new Schema({
  ctrid: String,
  comp: String,
  type: String,
  title: String,
  desc: String,
  created: { type: Date, default: Date.now },
  originctrid: String,
  access: [String],
  private: Boolean
});

module.exports = mongoose.model("control", controlSchema);
