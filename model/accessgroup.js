var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accessgroupSchema = new Schema({
  comp: String,
  groupid: String,
  name: String,
  desc: String,
  children: [
    {
      type: String,
      id: String
    }
  ]
});

module.exports = mongoose.model("accessgroup", fileuploadSchema);
