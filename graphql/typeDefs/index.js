var Graphql = require("graphql");
var { makeExecutableSchema } = require("graphql-tools");
scalar Date;
//var { company, menu, control, accessGroup } = require("../model/models");
var company = require("../../model/models")["Company"];

var menu = require("../../model/models")["Menu"];
var user = require("../../model/models")["User"];

const typeDefs = `
type company{
  _id:ID!,
   id: String,
    name: String,
    language: String,
    module: String
}
type user{
  _id:ID!,
  id:String,
  password:String!,
  email: String!,
  name: String!,
  group: String,
  comp: company
}
type control{
   _id:ID!,
   type: String,
    title: String,
    desc: String,
    created: Date,
    comp: company,
    origincontrol: control,
    access: [accessGroup],
    private: Boolean
}

type Query{
  companies:[company]
  users:[user]
    controls:[control]
  user(_id:ID!):user
}


`;


// const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers
// })
module.exports = typeDefs;