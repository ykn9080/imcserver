var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const companySchema = new Schema({
    id: String,
    name: String,
    language: String,
    module: String
});

module.exports = mongoose.model('company', companySchema);