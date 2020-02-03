var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  id: String,
  pid: String,
  comp: String,
  title: String,
  desc: String,
  creator: String,
  seq: Number,
  private: Boolean,
  access: [String],
  layout: [
    {
      rowseq: Number,
      colseq: Number,
      ctrid: String
    }
  ]
});

module.exports = mongoose.model("menu", localuserSchema);
