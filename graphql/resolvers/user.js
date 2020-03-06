var company = require("../../model/models")["Company"];
var user = require("../../model/models")["User"];

const resolvers = {
    Query: {
        companies() {
            return company.find({});
        },
        users() {
            user.find({}).populate("comp").exec((err, usr) => {
                return usr;
            });
        }

    },
    Mutation: {

    } // new
};





module.exports = resolvers;