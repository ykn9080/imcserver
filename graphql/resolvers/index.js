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

const resolvers = {
    Query: {
        companies() {
            return company.find({});
        },
        users() {
            return user.find({}).populate("comp")
            // .exec((err, usr) => {
            //     return usr;
            // });
        },
        // menues() {
        //     return menu.find({});
        // },
        async controls() {
            return await control.find({});
        },
        async user(parent, { _id }) {
            //return await user.findById(_id);
            return await user.findById(_id).populate("comp");
        },
        // async menu(parent, { _id }) {
        //     //return find(user, { id: id });
        //     return await menu.findById(_id);
        // },
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