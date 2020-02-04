var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = {};
/*
모든 모델을 한곳에서 처리
재사용 CRUD는 ./controller/reuseCRUD.js임
models.Menu, model.Control등으로 접근
/router/reuseCRUD.js에서 접근처리
*/
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

models.Control = mongoose.model("control", controlSchema);
models.Menu = mongoose.model("menu", menuSchema);
models.accessGroup = mongoose.model("accessGroup", accessGroupSchema);

module.exports = models;
