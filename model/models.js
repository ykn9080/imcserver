var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const models = {};
/*
모든 모델을 한곳에서 처리
재사용 CRUD는 ./controller/reuseCRUD.js임
models.Menu, model.Control등으로 접근
/router/reuseCRUD.js에서 접근처리
*/
const menuSchema = new Schema({
    title: String,
    desc: String,
    seq: Number,
    pid: { type: Schema.Types.ObjectId, ref: 'Menu' },
    comp: { type: Schema.Types.ObjectId, ref: 'Company' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    access: [{ type: Schema.Types.ObjectId, ref: 'AccessGroup' }],
    layout: [{
        ctrid: { type: Schema.Types.ObjectId, ref: 'Control' },
        seq: Number,
        size: Number,
    }]
});
const companySchema = new Schema({
    id: String,
    name: String,
    language: String,
    module: String
});
var userSchema = mongoose.Schema({
    id: String,
    password: String,
    email: String,
    name: String,
    group: [{ type: Schema.Types.ObjectId, ref: 'AccessGroup' }],
    comp: { type: Schema.Types.ObjectId, ref: 'Company' }
});
const accessGroupSchema = new Schema({
    comp: { type: Schema.Types.ObjectId, ref: 'Company' },
    name: String,
    desc: String,
    parent: { type: Schema.Types.ObjectId, ref: 'AccessGroup' }
});

const controlSchema = new Schema({
    type: String,
    title: String,
    desc: String,
    created: { type: Date, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    comp: { type: Schema.Types.ObjectId, ref: 'Company' },
    origincontrol: { type: Schema.Types.ObjectId, ref: 'Control' },
    access: [{ type: Schema.Types.ObjectId, ref: 'AccessGroup' }],
});
const simpleSchema = new Schema({
    name: String,
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    subgroup: [{ type: Schema.Types.ObjectId, ref: 'Simple' }]
});
models.Control = mongoose.model("Control", controlSchema);
models.Company = mongoose.model('Company', companySchema);
models.User = mongoose.model('User', userSchema);
models.Menu = mongoose.model("Menu", menuSchema);
models.AccessGroup = mongoose.model("AccessGroup", accessGroupSchema);
models.Simple = mongoose.model("Simple", simpleSchema);

module.exports = models;