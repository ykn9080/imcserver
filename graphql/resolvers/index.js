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
            // .exec((err, usr) => {
            //     return usr;
            // });
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
            return await menu.find({}).populate("layout.ctrid").populate("comp").populate("access");
        },
        async menu(parent, { _id }) {
            return await menu.findById(_id).populate("comp").populate("layout.ctrid").populate("access");
        },
        async controls() {
            return await control.find({}).populate("comp").populate("access");
        },
        async  control(parent, { _id }) {
            return await control.findById(_id).populate("comp").populate("access")
        },


        // async menues() {
        //     //return find(user, { id: id });
        //     return await menu.find({});
        // }
    }
    // Mutation: {
    //     async createMenu(root, { input }) {
    //         return await menu.create(input);
    //     }
    // } // new
};





module.exports = resolvers;