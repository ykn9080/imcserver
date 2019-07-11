var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileuploadSchema = new Schema({
    comp:String,
    userid:String,
    filepath: String,
    filesize: String,
    originalname: String,
    date: Date,
    drive: String

});

module.exports = mongoose.model('Fileupload', fileuploadSchema);