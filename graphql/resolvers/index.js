// const { merge } = require('lodash');

// const menu = require('./menu');
// const user = require('./user');
// const resolvers = merge({},
//     menu.resolver, user.resolvers);



// console.log('this is resolvers', resolvers)
// console.log('this for menu.resolvers', menu.resolvers, menu)

var Graphql = require("graphql");
//var { makeExecutableSchema } = require("graphql-tools");

//var { company, menu, control, accessGroup } = require("../model/models");
var company = require("../../model/models")["Company"];

var menu = require("../../model/models")["Menu"];
var user = require("../../model/models")["User"];
var control = require("../../model/models")["Control"];

const resolvers = {
    Query: {
        async companies() {
            return await company.find({});
        },
        async company(parent, { _id }) {
            return await company.findById(_id)
        },
        async users() {
            return await user.find({}).populate("comp")
        },
        async user(parent, { _id }) {
            //return await user.findById(_id);
            return await user.findById(_id).populate("comp");
        },
        async accessGroups() {
            return await accessGroup.find({});
        },
        async accessGroup(parent, { _id }) {
            return await accessGroup.findById(_id)
        },
        async menues() {
            return await menu.find({}).populate("pid").populate("layout.ctrid").populate("comp").populate("access");
        },
        async menu(parent, { _id }) {
            return await menu.findById(_id).populate("pid").populate("layout.ctrid").populate("comp").populate("access");
        },
        async controls() {
            return await control.find({}).populate("comp").populate("access");
        },
        async control(parent, { _id }) {
            return await control.findById(_id).populate("comp").populate("access")
        }
    },
    Mutation: {
        async addCompany(root, { id, name, language, module }) {
            const comp = new company({ id, name, language, module });
            await comp.save();
            return comp;
        },
        updateCompany: (root, { _id, id, name, language, module }) => {
            const comp = company.findById(_id);
            if (!comp) {
                throw new Error(`Couldn’t find author with _id ${_id}`);
            }
            comp.id = id;
            comp.name = name;
            comp.language = language;
            comp.module = module;
            return comp;
        },
        deleteCompany: (root, { _id }) => {
            const isExists = company.findIndex((comp) => comp._id === _id)

            if (!isExists) {
                throw new Error('Not exist!')
            }
            //splice will return the removed items from the array object
            const deleted = company.splice(isExists, 1)
            return deleted[0]
        }
    }
};





module.exports = resolvers;