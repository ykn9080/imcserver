var dbfunc = require('../function/dbfunc');
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const config = require('../config');
//var mongoDB='mongodb://yknam:ykn9080@ds135399.mlab.com:35399/imcdb';
//mongoose.connect(config.currentsetting.datasrc,{ useNewUrlParser: true });

// Set up mongoose connection
// let connect = 'mongodb://yknam:ykn9080@ds135399.mlab.com:35399/imcdb';
// mongoose.connect(connect);
//mongoose.Promise = global.Promise;


function findCollection(schemaname, schema) {
    const collectionSchema = new Schema(schema);
    return mongoose.model(schemaname, collectionSchema);
}

function initmongoose(connectstr) {
    mongoose.connect(connectstr, { useNewUrlParser: true });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

exports.findAll = async (req, res) => {
    if (!req.body.hasOwnProperty("callback"))
        req.body.callback = rtn;
    find1(req, res);
};
exports.find = function(req, res) {
    if (!req.body.hasOwnProperty("callback"))
        req.body.callback = dbfunc.dbCallback;
    find1(req, res);
};
var find1 = function(req, res) {
    initmongoose(req.body.connect);
    var condition = "";
    if (req.body.hasOwnProperty("paramarr"))
        condition = dbfunc.mongoParam(req.body.paramarr,req.user);
    const SchemaName = req.body.spname;

    var collection;
    // if no current model exists register and return new model
    if (mongoose.models && mongoose.models[SchemaName])
        collection = mongoose.models[SchemaName]
    else {
        const CollectionSchema = new Schema({}, { strict: false });
        collection = mongoose.model(SchemaName, CollectionSchema)
    }
    if (condition == "")
        collection.find(function(err, collect) {
            if (err) return next(err.name);
            req.body.callback(collect, res);
        });
    else
        collection.find(condition, function(err, collect) {
            if (err) collection = err.name;
            req.body.callback(collect, res);
        });
}
exports.create = function(req, res) {
    //var conn = mongoose.createConnection(req.body.connectstr, {server:{poolSize:2}});
    initmongoose(req.body.connect);
    var sname = req.body.schemaname;
    const helpSchema = new Schema({
        name: String,
        value: String
    });
    var Help = mongoose.model(sname, helpSchema)

    let help = new Help({
        name: req.body.name,
        price: req.body.price
    });

    help.save(function(err) {
        if (err) {
            return next(err);
        }
        res.send('Product Created successfully')
    })
};
// exports.update = function (req, res) {
//     Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
//         if (err) return next(err);
//         res.send('Product udpated.');
//     });
// };


exports.delete = function(req, res) {
    initmongoose(req.body.connect);
    var condition = "";
    if (req.body.hasOwnProperty("paramarr"))
        condition = dbfunc.mongoParam(req.body.paramarr,req.user);
    const SchemaName = req.body.spname;

    var collection;
    // if no current model exists register and return new model
 if (mongoose.models && mongoose.models[SchemaName])
        collection = mongoose.models[SchemaName]
    else {
        const CollectionSchema = new Schema({}, { strict: false });
        collection = mongoose.model(SchemaName, CollectionSchema)
    }
    if (condition != "")
        collection.remove(condition, function(err, collect) {
            if (err) collection = err.name;
             if (req.body.hasOwnProperty("callback"))
            req.body.callback(collect, res);
        });
};